$content = Get-Content "Program.cs" -Raw
$old = "builder.Services.AddScoped<ISessionService, SessionService>();\r\n\r\nbuilder.Services.AddScoped<IColumnService, ColumnService>();"
$new = "builder.Services.AddScoped<ISessionService, SessionService>();`r`n`r`nbuilder.Services.AddScoped<IColumnService, ColumnService>();"

# Fix the literal \r\n that was written incorrectly
$content = $content -replace [regex]::Escape("builder.Services.AddScoped<ISessionService, SessionService>();\r\n\r\nbuilder.Services.AddScoped<IColumnService, ColumnService>();"), "builder.Services.AddScoped<ISessionService, SessionService>();`r`n`r`nbuilder.Services.AddScoped<IColumnService, ColumnService>();"

Set-Content "Program.cs" $content -NoNewline
Write-Host "Done"
