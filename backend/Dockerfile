FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /opt/app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

RUN ./mvnw dependency:go-offline

COPY src ./src

RUN ./mvnw package -DskipTests

FROM eclipse-temurin:21
WORKDIR /opt/app
COPY --from=builder /opt/app/target/*.jar app.jar
ENTRYPOINT ["java","-jar","app.jar"]