package br.edu.ifpr.fincontrol.backend.exception;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
            ResourceNotFoundException ex) {

        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.NOT_FOUND.value())
                .error(HttpStatus.NOT_FOUND.getReasonPhrase())
                .message(ex.getMessage())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);

    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException ex) {

            ErrorResponse error = ErrorResponse.builder()
                            .timestamp(LocalDateTime.now())
                            .status(HttpStatus.UNPROCESSABLE_CONTENT.value())
                            .error(HttpStatus.UNPROCESSABLE_CONTENT.getReasonPhrase())
                            .message(ex.getMessage())
                            .build();

            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_CONTENT).body(error);
    }


    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(
    AccessDeniedException ex) {
    
    ErrorResponse error = ErrorResponse.builder()
    .timestamp(LocalDateTime.now())
    .status(HttpStatus.FORBIDDEN.value())
    .error(HttpStatus.FORBIDDEN.getReasonPhrase())
    .message("Acesso negado.")
    .build();
    
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    
    }


    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrity(
            DataIntegrityViolationException ex) {

        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.CONFLICT.value())
                .error(HttpStatus.CONFLICT.getReasonPhrase())
                .message("Violação de integridade dos dados.")
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);

    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex) {

        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(" | "));

        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .message(message)
                .build();

        return ResponseEntity.badRequest().body(error);

    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex) {

            ErrorResponse error = ErrorResponse.builder()
                            .timestamp(LocalDateTime.now())
                            .status(HttpStatus.UNAUTHORIZED.value())
                            .error(HttpStatus.UNAUTHORIZED.getReasonPhrase())
                            .message("E-mail ou senha inválidos.")
                            .build();

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

}