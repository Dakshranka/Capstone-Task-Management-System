FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn -DskipTests clean package

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Use a non-root user for better container security.
RUN addgroup -S spring && adduser -S spring -G spring

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8081

USER spring:spring

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
