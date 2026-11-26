# Etapa de compilação
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build

WORKDIR /workspace

COPY pom.xml .
COPY src ./src

RUN mvn -B -DskipTests clean package


# Etapa de execução
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Configuração do fuso horário brasileiro
RUN apk add --no-cache tzdata

ENV TZ=America/Sao_Paulo

# Ajustes para reduzir o consumo de memória da JVM.
# O Koyeb Free possui somente 512 MB de RAM.
ENV JAVA_TOOL_OPTIONS="-XX:ActiveProcessorCount=1 -XX:+UseSerialGC -XX:MaxRAMPercentage=45.0 -XX:InitialRAMPercentage=10.0 -XX:MaxMetaspaceSize=112m -XX:MaxDirectMemorySize=48m -XX:ReservedCodeCacheSize=32m -Xss512k -Duser.timezone=America/Sao_Paulo"

COPY --from=build /workspace/target/backend-0.0.1-SNAPSHOT.jar /app/app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]