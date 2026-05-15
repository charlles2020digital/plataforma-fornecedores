# Servidor HTTP local para a ELITE Atacado Brasil
$porta = 8080
$root  = $PSScriptRoot

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$porta/")
$listener.Start()

Write-Host ""
Write-Host "  ============================================"
Write-Host "   ELITE Atacado Brasil — Servidor Local"
Write-Host "   Aberto em: http://localhost:$porta/plataforma.html"
Write-Host "   Pressione Ctrl+C para encerrar."
Write-Host "  ============================================"
Write-Host ""

$tipos = @{
    '.html' = 'text/html; charset=utf-8'
    '.css'  = 'text/css'
    '.js'   = 'application/javascript'
    '.json' = 'application/json'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.ico'  = 'image/x-icon'
    '.svg'  = 'image/svg+xml'
    '.pdf'  = 'application/pdf'
}

while ($listener.IsListening) {
    try {
        $ctx = $listener.GetContext()
        $req = $ctx.Request
        $res = $ctx.Response

        $caminho = $req.Url.LocalPath.TrimStart('/')
        if ($caminho -eq '') { $caminho = 'plataforma.html' }

        $arquivo = Join-Path $root $caminho

        if (Test-Path $arquivo -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($arquivo)
            $ext   = [System.IO.Path]::GetExtension($arquivo).ToLower()
            $mime  = $tipos[$ext]
            if (-not $mime) { $mime = 'application/octet-stream' }
            $res.ContentType      = $mime
            $res.ContentLength64  = $bytes.Length
            $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $res.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes('404 - Arquivo nao encontrado')
            $res.OutputStream.Write($msg, 0, $msg.Length)
        }

        $res.OutputStream.Close()
    } catch {
        # ignora erros de conexão interrompida
    }
}
