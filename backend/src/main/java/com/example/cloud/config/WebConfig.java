package com.example.cloud.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // No custom PathMatchConfigurer, rely on Spring Boot defaults (PathPatternParser)
    // If specific path matching tweaks are needed later, they can be added carefully.
    // For example, to ensure dot truncation is off if it becomes an issue again:
    // @Override
    // public void configurePathMatch(PathMatchConfigurer configurer) {
    //     configurer.setUseSuffixPatternMatch(false);
    //     configurer.setUseRegisteredSuffixPatternMatch(false);
    // }
    // However, PathPatternParser (default in Spring Boot 3+) should handle this better.
}
