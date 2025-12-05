package com.example.cloud.auth.util;

import org.postgresql.util.PSQLException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler()
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage())
        );

        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleUniqueConstraintViolation(DataIntegrityViolationException ex) {
        if (ex.getRootCause() instanceof PSQLException psqlEx) {
            String message = psqlEx.getMessage();
            if (message.contains("unique_nickname")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The username should be unique.");
            } else if (message.contains("unique_email")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The email should be unique.");
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Database error. Please check the data you entered.");
    }
}