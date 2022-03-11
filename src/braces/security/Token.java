package braces.security;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class Token {

    public static String generateToken(String username){
        String header = "HS256JWT";
        String salt = "Tremolo";
        String token = "";

        token += makeSHA(header) + ".";
        token += makeSHA(username) + ".";
        token = makeSHA(token + salt);

        return token;
    }

    public static String makeSHA(String code){
        MessageDigest messageDigest = null;
        byte[] digest = new byte[0];
        try {
            messageDigest = MessageDigest.getInstance("SHA-256");
            messageDigest.reset();
            messageDigest.update(code.getBytes());
            digest = messageDigest.digest();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }

        BigInteger bigInt = new BigInteger(1, digest);
        return bigInt.toString(16);
    }
}