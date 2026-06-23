<?php
/**
 * BUG SQUASHER — Leaderboard API
 * Speichert und liefert Highscores via MySQL auf Strato.
 *
 * Endpoints:
 *   POST /api.php          → Score speichern (JSON body)
 *   GET  /api.php          → Top 20 Scores abrufen
 *   POST /api.php?action=click → Link-Click tracken
 *
 * Setup:
 *   1. MySQL-Datenbank bei Strato anlegen (Hosting-Verwaltung)
 *   2. DB_* Konstanten unten ausfüllen
 *   3. Diese Datei in den gleichen Ordner wie index.html hochladen
 *   4. In game.js setzen:
 *        LEADERBOARD_URL: 'https://DEINE-DOMAIN.de/PFAD/api.php',
 *        CLICK_COUNTER_URL: 'https://DEINE-DOMAIN.de/PFAD/api.php?action=click',
 */

// ============================================================
// KONFIGURATION — hier deine Strato-DB-Daten eintragen
// ============================================================
define('DB_HOST', 'localhost');       // bei Strato meist 'localhost'
define('DB_NAME', 'DEINE_DATENBANK'); // Name der MySQL-DB
define('DB_USER', 'DEIN_BENUTZER');   // MySQL-Benutzername
define('DB_PASS', 'DEIN_PASSWORT');   // MySQL-Passwort
define('ADMIN_KEY', 'GSE_ADMIN_2026'); // Geheimer Key für Admin-Zugriff

// ============================================================
// CORS + JSON Headers
// ============================================================
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ============================================================
// DB-Verbindung
// ============================================================
function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER, DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
             PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
        );
    }
    return $pdo;
}

// ============================================================
// Tabellen anlegen (einmalig beim ersten Aufruf)
// ============================================================
function ensureTables() {
    $db = getDB();
    $db->exec("
        CREATE TABLE IF NOT EXISTS scores (
            id       INT AUTO_INCREMENT PRIMARY KEY,
            name     VARCHAR(20) NOT NULL,
            score    INT NOT NULL DEFAULT 0,
            wave     INT NOT NULL DEFAULT 0,
            lang     VARCHAR(5) DEFAULT 'en',
            device   VARCHAR(10) DEFAULT 'desktop',
            created  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_score (score DESC)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    $db->exec("
        CREATE TABLE IF NOT EXISTS clicks (
            id      INT AUTO_INCREMENT PRIMARY KEY,
            source  VARCHAR(50) DEFAULT 'footer',
            lang    VARCHAR(5) DEFAULT 'en',
            created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
}

// ============================================================
// Router
// ============================================================
try {
    ensureTables();
    $action  = $_GET['action'] ?? '';
    $method  = $_SERVER['REQUEST_METHOD'];

    // --- Track click ---
    if ($action === 'click' && $method === 'POST') {
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $db = getDB();
        $stmt = $db->prepare("INSERT INTO clicks (source, lang) VALUES (:source, :lang)");
        $stmt->execute([
            ':source' => substr($body['source'] ?? 'footer', 0, 50),
            ':lang'   => substr($body['lang']   ?? 'en',     0, 5),
        ]);
        echo json_encode(['ok' => true, 'id' => (int)$db->lastInsertId()]);
        exit;
    }

    // --- Save score ---
    if ($method === 'POST' && $action === '') {
        $body = json_decode(file_get_contents('php://input'), true);
        if (!$body || !isset($body['name'], $body['score'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing name or score']);
            exit;
        }
        $name  = substr(trim($body['name']),  0, 20);
        $score = (int) $body['score'];
        $wave  = (int) ($body['wave']  ?? 0);
        $lang  = substr($body['lang']  ?? 'en', 0, 5);
        $touch = !empty($body['touch']) ? 'mobile' : 'desktop';

        if ($name === '' || $score < 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid data']);
            exit;
        }

        $db = getDB();
        $stmt = $db->prepare("
            INSERT INTO scores (name, score, wave, lang, device)
            VALUES (:name, :score, :wave, :lang, :device)
        ");
        $stmt->execute([
            ':name'   => $name,
            ':score'  => $score,
            ':wave'   => $wave,
            ':lang'   => $lang,
            ':device' => $touch,
        ]);
        echo json_encode(['ok' => true, 'id' => (int)$db->lastInsertId()]);
        exit;
    }

    // --- Get leaderboard ---
    if ($method === 'GET' && $action === '') {
        $limit = min((int)($_GET['limit'] ?? 20), 100);
        $db = getDB();
        $stmt = $db->prepare("
            SELECT name, score, wave, lang, device
            FROM scores
            ORDER BY score DESC
            LIMIT :limit
        ");
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll();
        echo json_encode($rows);
        exit;
    }

    // --- Admin stats (hidden, key-protected) ---
    if ($method === 'GET' && $action === 'admin') {
        if (($_GET['key'] ?? '') !== ADMIN_KEY) {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden']);
            exit;
        }
        $db = getDB();
        $stats = [];

        // Total scores
        $stats['total_scores'] = (int)$db->query("SELECT COUNT(*) FROM scores")->fetchColumn();
        $stats['total_clicks'] = (int)$db->query("SELECT COUNT(*) FROM clicks")->fetchColumn();

        // Top 10
        $stats['top10'] = $db->query("
            SELECT name, score, wave, lang, device, created
            FROM scores ORDER BY score DESC LIMIT 10
        ")->fetchAll();

        // By language
        $stats['by_lang'] = $db->query("
            SELECT lang, COUNT(*) as plays FROM scores GROUP BY lang ORDER BY plays DESC
        ")->fetchAll();

        // By device
        $stats['by_device'] = $db->query("
            SELECT device, COUNT(*) as plays FROM scores GROUP BY device
        ")->fetchAll();

        // Click stats
        $stats['clicks_by_lang'] = $db->query("
            SELECT lang, COUNT(*) as clicks FROM clicks GROUP BY lang ORDER BY clicks DESC
        ")->fetchAll();

        // Daily activity
        $stats['daily'] = $db->query("
            SELECT DATE(created) as day, COUNT(*) as games
            FROM scores GROUP BY DATE(created) ORDER BY day DESC LIMIT 14
        ")->fetchAll();

        echo json_encode($stats, JSON_PRETTY_PRINT);
        exit;
    }

    http_response_code(404);
    echo json_encode(['error' => 'Not found']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
