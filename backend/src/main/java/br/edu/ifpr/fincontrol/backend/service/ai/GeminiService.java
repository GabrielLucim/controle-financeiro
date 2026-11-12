package br.edu.ifpr.fincontrol.backend.service.ai;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;

@Service
public class GeminiService {

    private static final Logger LOGGER = LoggerFactory.getLogger(GeminiService.class);

    @Value("${gemini.api-key:}")
    private String apiKey;

    @Value("${gemini.model:gemini-3.8-flash}")
    private String model;

    @Value("${gemini.max-output-tokens:1200}")
    private Integer maxOutputTokens;

    private volatile Client client;

    public String generateText(
            String systemInstruction,
            String prompt) {

        if (apiKey == null || apiKey.isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.SERVICE_UNAVAILABLE,
                "A integração com Gemini não está configurada. Configure a variável GOOGLE_API_KEY.");
        }

        try {

            Content instruction = Content.fromParts(
                    Part.fromText(systemInstruction));

            GenerateContentConfig config = GenerateContentConfig.builder()
                    .candidateCount(1)
                    .maxOutputTokens(maxOutputTokens)
                    .systemInstruction(instruction)
                    .build();

            GenerateContentResponse response = getClient().models
                    .generateContent(model, prompt, config);

            String generatedText = response.text();

            if (generatedText == null || generatedText.isBlank()) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "O Gemini não retornou uma análise válida.");
            }

            return generatedText.trim();

        } catch (ResponseStatusException exception) {

            throw exception;

        } catch (Exception exception) {

            LOGGER.error(
                "Erro ao comunicar com a API Gemini. Tipo: {}",
                exception.getClass().getSimpleName());

            throw new ResponseStatusException(
                HttpStatus.BAD_GATEWAY,
                "Não foi possível gerar a análise financeira no momento.");
        }
    }

    private Client getClient() {
        Client currentClient = client;

        if (currentClient == null) {
            synchronized (this) {
                currentClient = client;
                if (currentClient == null) {
                    currentClient = Client.builder()
                            .apiKey(apiKey)
                            .build();
                    client = currentClient;
                }
            }
        }

        return currentClient;
    }
}
