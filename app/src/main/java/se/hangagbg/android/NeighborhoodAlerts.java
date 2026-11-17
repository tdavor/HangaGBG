package se.hangagbg.android;

import java.text.Normalizer;
import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.Locale;

final class NeighborhoodAlerts {
    private NeighborhoodAlerts() {}

    static boolean matches(String profileArea, String eventArea, String start) {
        if (profileArea.trim().isEmpty() || !normalize(profileArea).equals(normalize(eventArea))) return false;
        try {
            return Instant.parse(start).isAfter(Instant.now());
        } catch (DateTimeParseException ignored) {
            return false;
        }
    }

    private static String normalize(String area) {
        return Normalizer.normalize(area.trim().replaceAll("\\s+", " ").toLowerCase(Locale.ROOT), Normalizer.Form.NFC);
    }
}
