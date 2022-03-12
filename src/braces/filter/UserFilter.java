package braces.filter;

import braces.entities.DataBase;
import braces.entities.User;

import javax.ejb.EJB;
import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Objects;

@WebFilter(urlPatterns = {"/api/points/*", "/api/user/profile/*"})
public class UserFilter implements Filter {

    @EJB
    private DataBase dataBase;
    private User user;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        try {
            String authorization = request.getHeader("Authorization");
            String[] authValues = null;
            String token = null;
            if (authorization != null && authorization.toLowerCase().startsWith("bearer")) {
                authValues = authorization.split(",");
                token = authValues[1];
            }

            String[] path = request.getPathInfo().split("/");
            String username = path[path.length - 1];
            System.out.println(username);
            user = dataBase.getProfile(username);
            String realToken = user.getToken().trim();
            request.setAttribute("username", user.getUsername());
            if (token != null && !Objects.equals(realToken, token.trim())) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            } else {
                filterChain.doFilter(request, response);
            }
        } catch (NullPointerException e){

            System.out.println("test 2");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }

    @Override
    public void destroy() {

    }
}