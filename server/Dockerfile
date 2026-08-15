# Stage 1 - BUILDER

FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

COPY pom.xml .
COPY . .

RUN mvn clean package -DskipTests

# Stage 2 - Dockerization

FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8084

CMD [ "java", "-jar", "app.jar" ]