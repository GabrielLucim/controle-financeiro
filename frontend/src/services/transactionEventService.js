import api from "./api";

const INITIAL_RECONNECT_DELAY = 1000;
const MAX_RECONNECT_DELAY = 30000;
const MAX_RECONNECT_ATTEMPTS = 5;

export const transactionEventService = {
    subscribe(onTransactionChanged, onStatusChanged = () => { }) {
        let isActive = true;
        let eventSource = null;
        let reconnectTimer = null;
        let reconnectAttempts = 0;
        let isRequestingTicket = false;

        const updateStatus = (status) => {
            if (isActive) {
                onStatusChanged(status);
            }
        };

        const scheduleReconnect = () => {
            if (!isActive || reconnectTimer !== null) {
                return;
            }

            updateStatus("reconnecting");

            const delay = Math.min(
                INITIAL_RECONNECT_DELAY * (2 ** Math.min(
                    reconnectAttempts,
                    MAX_RECONNECT_ATTEMPTS
                )),
                MAX_RECONNECT_DELAY
            );

            reconnectAttempts += 1;

            reconnectTimer = window.setTimeout(() => {
                reconnectTimer = null;
                connect();
            }, delay);
        };

        const connect = async () => {
            if (!isActive || isRequestingTicket) {
                return;
            }

            isRequestingTicket = true;

            try {
                const response = await api.post("/transactions/stream-ticket");
                const ticket = response.data?.ticket;

                if (!ticket) {
                    throw new Error("O backend não retornou um ticket SSE.");
                }

                if (!isActive) {
                    return;
                }

                const streamUrl = new URL(
                    api.getUri({ url: "/transactions/stream" }),
                    window.location.origin
                );

                streamUrl.searchParams.set("ticket", ticket);

                const source = new EventSource(streamUrl.toString());
                eventSource = source;

                source.onopen = () => {
                    if (!isActive) {
                        source.close();
                        return;
                    }

                    reconnectAttempts = 0;
                    updateStatus("connected");
                };

                source.addEventListener(
                    "transaction-changed",
                    onTransactionChanged
                );

                source.onerror = () => {
                    if (!isActive) {
                        source.close();
                        return;
                    }

                    const permanentlyClosed = source.readyState === EventSource.CLOSED;

                    source.close();

                    if (eventSource === source) {
                        eventSource = null;
                    }

                    if (permanentlyClosed) {
                        updateStatus("connection-error");
                        return;
                    }

                    scheduleReconnect();
                };
            } catch (error) {
                if (!isActive) {
                    return;
                }

                const status = error.response?.status;

                if (status === 401 || status === 403) {
                    updateStatus("authentication-error");
                    return;
                }

                console.error("Erro ao estabelecer conexão SSE:", error);
                scheduleReconnect();
            } finally {
                isRequestingTicket = false;
            }
        };

        updateStatus("connecting");
        connect();

        return () => {
            isActive = false;

            if (reconnectTimer !== null) {
                window.clearTimeout(reconnectTimer);
            }

            if (eventSource) {
                eventSource.close();
                eventSource = null;
            }
        };
    }
};
