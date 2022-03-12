package braces.entities;

import com.sun.istack.internal.NotNull;

import javax.annotation.PostConstruct;
import javax.persistence.*;
import java.io.Serializable;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

import static java.lang.Math.ceil;
import static java.lang.Math.floor;

@Entity
@Table(name="results")
public class FormBean implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private double x;
    private double y;
    private double R;
    private boolean result;
    private long workTime;
    private String currentTime;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "username")
    private User user;

    public FormBean(){}

    public FormBean(double x, double y, double R){
        this.x = x;
        this.y = y;
        this.R = R;
    }

    public void setId(long id) { this.id = id; }

    public void setX(double x) {
        this.x = x;
    }

    public void setY(double y) {
        this.y = y;
    }

    public void setR(double R) {
        this.R = R;
    }

    public void setResult(boolean result) { this.result = result; }

    public void setCurrentTime(String currentTime) { this.currentTime = currentTime; }

    public void setWorkTime(long workTime) { this.workTime = workTime; }

    public long getId() { return id; }

    public double getX() { return x; }

    public double getY() { return y; }

    public double getR() { return R; }

    public boolean getResult() {
        if (this.x < -5 || this.y < -5 || this.R <= 0) return false;
        setResult(checkArea(x, y));
        return result;
    }

    public long getWorkTime() { return workTime; }

    public String getCurrentTime() { return currentTime; }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public boolean checkArea(double x, double y){
        boolean res = false;

        //for circle
        if (x>= 0 && y <= 0 && Double.compare(x*x + y*y, R*R) <= 0){
            res = true;
        }

        //for rectangle
        if (x <= 0 && Double.compare(-x, R/2) <= 0 && y >= 0 && Double.compare(y, R) <= 0){
            res = true;
        }

        //for triangle
        if (x >= 0 && y >= 0 && Double.compare(2*x + y, R) <= 0){
            res = true;
        }

        return res;
    }

}