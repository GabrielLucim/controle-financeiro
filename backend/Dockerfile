# ============================================================
# ETAPA 1 - COMPILAÇÃO DA APLICAÇÃO
# ============================================================

FROM maven:3.9.9-eclipse-temurin-21-alpine AS build

WORKDIR /workspace

# Copia as configurações do Maven
COPY pom.xml .

# Copia o código-fonte
COPY src ./src

# Compila e empacota a aplicação Spring Boot
RUN mvn -B -DskipTests clean package


# ============================================================
# ETAPA 2 - EXECUÇÃO DA APLICAÇÃO
# ============================================================

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Certificados para conexões HTTPS/TLS e fuso horário brasileiro
RUN apk add --no-cache ca-certificates tzdata

ENV TZ=America/Sao_Paulo

# Ajustes de memória para o plano gratuito da Render (512 MB).
# SerialGC reduz o consumo de memória da JVM.
ENV JAVA_TOOL_OPTIONS="-XX:ActiveProcessorCount=1 -XX:+UseSerialGC -XX:MaxRAMPercentage=45.0 -XX:InitialRAMPercentage=10.0 -XX:MaxMetaspaceSize=128m -XX:MaxDirectMemorySize=32m -XX:ReservedCodeCacheSize=32m -Xss512k -Duser.timezone=America/Sao_Paulo"

# Copia o JAR gerado na etapa de compilação
COPY --from=build /workspace/target/backend-0.0.1-SNAPSHOT.jar /app/app.jar

# Porta padrão dos serviços Web da Render
EXPOSE 10000

# Inicia a aplicação
ENTRYPOINT ["java", "-jar", "/app/app.jar"]