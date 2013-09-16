package au.org.ala.fieldcapture

import java.lang.annotation.Documented
import java.lang.annotation.ElementType
import java.lang.annotation.Retention
import java.lang.annotation.RetentionPolicy
import java.lang.annotation.Target

/**
 * Annotation to check if user has "edit" or "admin" permissions
 * for a given controller method
 *
 * @author Nick dos Remedios (nick.dosremedios@csiro.au)
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface PreAuthorise {
    String accessLevel() default "editor" // TODO: change to AccessLevel class from ecodata (shared via webservices somehow)
    String projectIdParam() default "id"
    String redirectController() default "project"
    String redirectAction() default "index"
}
