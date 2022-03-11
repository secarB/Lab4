package braces.entities;

import javax.ejb.Singleton;
import javax.persistence.*;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Singleton
public class DataBase implements Serializable {

    @PersistenceContext(unitName = "manager")
    private EntityManager entityManager;

    public DataBase() {}

    public void setEntityManager(EntityManager entityManager) { this.entityManager = entityManager; }

    public EntityManager getEntityManager() { return entityManager; }

    public void saveData(FormBean formBean, String username) {
        User user = entityManager.find(User.class, username);
        formBean.setUser(user);
        formBean.setWorkTime(System.currentTimeMillis());
        formBean.getResult();
        formBean.setWorkTime(System.currentTimeMillis() - formBean.getWorkTime());
        SimpleDateFormat sDFormat = new SimpleDateFormat("HH:mm:ss");
        formBean.setCurrentTime(sDFormat.format(Calendar.getInstance().getTime()));
        entityManager.persist(formBean);
    }

    public List<FormBean> getList(String username){
        return new ArrayList<>((entityManager.createQuery("select res from FormBean res where res.user.username = :username", FormBean.class))
                .setParameter("username", username).getResultList());
    }

    public void clear(String username){
        entityManager.createQuery("delete from User res where res.username like :username").setParameter("username", username);
    }

    public void addPoint(double x, double y, double r, String username){
        saveData(new FormBean(x, y, r), username);
    }

    public void setUser(String username, String password, String token) {
        User user = new User(username, password, token);
        entityManager.persist(user);
    }

    public void saveToken(User user, String token){
        entityManager.getTransaction().begin();
        user.setToken(token);
        entityManager.getTransaction().commit();
    }

    public User getProfile(String username){
        User user;
        user = entityManager.find(User.class, username);
        return user;
    }
}