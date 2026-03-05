package com.budanga.ordersystem.service;

import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.Map;

@Service
public class LoginAttemptService {

    private static final int MAX_ATTEMPT = 5;
    private final Map<String, Integer> attemptsCache = new ConcurrentHashMap<>();
    private final Map<String, Long> blockCache = new ConcurrentHashMap<>();

    public void loginSucceeded(String key) {
        attemptsCache.remove(key);
        blockCache.remove(key);
    }

    public void loginFailed(String key) {
        int attempts = attemptsCache.getOrDefault(key, 0);
        attempts++;
        attemptsCache.put(key, attempts);
        if (attempts >= MAX_ATTEMPT) {
            blockCache.put(key, System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(15));
        }
    }

    public boolean isBlocked(String key) {
        if (!blockCache.containsKey(key)) {
            return false;
        }
        if (blockCache.get(key) < System.currentTimeMillis()) {
            blockCache.remove(key);
            attemptsCache.remove(key);
            return false;
        }
        return true;
    }
}
