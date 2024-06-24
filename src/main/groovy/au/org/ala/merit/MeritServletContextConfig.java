package au.org.ala.merit;

import org.springframework.boot.web.servlet.ServletContextInitializer;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;

/** This class exists to register the SessionLogger as an HttpEventListener */
public class MeritServletContextConfig implements ServletContextInitializer {

    @Override
    public void onStartup(ServletContext servletContext) throws ServletException {
        servletContext.addListener(SessionLogger.class);
    }
}
