package com.example.server.utils.validator;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;

@Constraint(validatedBy = UniqueValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Unique {

    String message() default "Value already exists";

    Class<?>[] groups() default {};

    Class<?>[] payload() default {};

    String columnName();

    String tableName();

}
