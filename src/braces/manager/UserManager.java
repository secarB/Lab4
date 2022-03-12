package braces.manager;


//import braces.entities.DataBase;
//import braces.entities.User;
import braces.entities.DataBase;
import braces.entities.User;
import braces.security.SecurePassword;
import braces.security.Token;

import javax.ejb.EJB;
import javax.ejb.Singleton;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/user")
public class UserManager {
    @GET
    public String test()
    {
        return "lol";
    }

   @EJB
   private DataBase dataBase;

    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Path("/register/{username}")
    public Response addUser(@PathParam("username") String username, @Context HttpServletRequest request, @FormParam("password") String password) {

        User user = null;
        try {
            user = dataBase.getProfile(username);
            if (user != null){
                return Response.status(Response.Status.FORBIDDEN).build();
            }
            password = SecurePassword.generate(password);
            String token = Token.generateToken(username);
            dataBase.setUser(username, password, token);
            user = dataBase.getProfile(username);
        } catch (Exception e){
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        return Response.ok(user.getToken()).build();
    }

    @GET
    @Path("/profile/{username}")
    public Response getProfileUser(@PathParam("username") String username){
        User user = null;
        try {
            user = dataBase.getProfile(username);
        } catch (Exception e){
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        return Response.ok(user.getToken()).build();
    }

    @POST
    @Path("/login/{username}")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response checkUser(@PathParam("username") String username, @FormParam("password") String password){
        User user = null;
        try {
            user = dataBase.getProfile(username);
            if (user != null) {
                password = SecurePassword.generate(password);
                String realPass = user.getPassword().trim();
                if (!realPass.equals(password.trim())){
                return Response.status(Response.Status.UNAUTHORIZED).build();
                }
            } else
            {
                return Response.status(Response.Status.FORBIDDEN).build();
            }
        } catch (Exception e){
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        return Response.ok(user.getToken()).build();
    }
}