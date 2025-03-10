package com.example.server.utils.validator;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;

@Constraint(validatedBy = PasswordMatchValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface PasswordMatch {

    String message() default "Passwords do not match";

    Class<?>[] groups() default {};

    Class<?>[] payload() default {};

    String passwordFieldName();

    String passwordMatchFieldName();
}
