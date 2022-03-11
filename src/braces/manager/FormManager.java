package braces.manager;

//import braces.entities.DataBase;
//import braces.entities.FormBean;

import braces.entities.DataBase;
import braces.entities.FormBean;

import javax.ejb.EJB;
import javax.ejb.Singleton;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/points/{username}")
public class FormManager {

    @EJB
    private DataBase dataBase;

    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response addPoint(@PathParam("username") String username,
                             @Context HttpServletRequest request, @Context HttpServletResponse response,
                             @FormParam("x") Double x, @FormParam("y") Double y, @FormParam("r") Double r) {

        List<FormBean> res = null;
        try {
            //String realUser = (String) request.getAttribute("username");
        //    if (realUser == null || !realUser.trim().equals(username))
          //      throw new NotAuthorizedException("Unauthorized");
                dataBase.addPoint(x, y, r, username);
            res = dataBase.getList(username);
        } catch (NotAuthorizedException e){
            return Response.status(Response.Status.UNAUTHORIZED).build();
        } catch (Exception e){
            return Response.status(Response.Status. BAD_REQUEST).build();
        }
        return Response.ok(res).build();
    }

    @GET
    public Response getPoints(@PathParam("username") String username){
        List<FormBean> res = null;
        try {
            res = dataBase.getList(username);
        } catch (Exception e){
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        return Response.ok(res).build();
    }

}
