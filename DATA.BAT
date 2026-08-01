@echo off
setlocal enabledelayedexpansion

:: ==========================================
:: SETTING FOLDER & FILE
:: ==========================================
:: Mengambil path folder tempat file .bat ini berada
set "SOURCE_DIR=%~dp0"

:: Nama folder tujuan untuk menampung semua file
set "DEST_DIR=%SOURCE_DIR%Folder_Gabungan"

:: Nama file hasil pendataan (log)
set "LOG_FILE=%SOURCE_DIR%Daftar_Isi_Folder.txt"

echo ==================================================
echo       PROGRAM PENDATAAN DAN PENGGABUNGAN FILE
echo ==================================================
echo.

:: ------------------------------------------
:: 1. MENDATA ISI FOLDER
:: ------------------------------------------
echo [1/3] Mendata semua isi folder dan subfolder...
dir "%SOURCE_DIR%" /s /b > "%LOG_FILE%"
echo [+] Data berhasil disimpan ke: Daftar_Isi_Folder.txt
echo.

:: ------------------------------------------
:: 2. MEMBUAT FOLDER TUJUAN BARU
:: ------------------------------------------
echo [2/3] Memeriksa/Membuat folder tujuan...
if not exist "%DEST_DIR%" (
    mkdir "%DEST_DIR%"
    echo [+] Folder tujuan dibuat: Folder_Gabungan
) else (
    echo [+] Folder tujuan sudah ada.
)
echo.

:: ------------------------------------------
:: 3. MENGCOPY SEMUA FILE KE FOLDER BARU
:: ------------------------------------------
echo [3/3] Meng-copy semua file ke dalam folder tujuan...
for /r "%SOURCE_DIR%" %%F in (*) do (
    :: Hindari meng-copy file dari folder tujuan itu sendiri, file log, dan file .bat ini
    if not "%%~dpF"=="%DEST_DIR%\" (
        if not "%%~fF"=="%LOG_FILE%" (
            if not "%%~fF"=="%~f0" (
                echo Copying: %%~nxF
                copy "%%~fF" "%DEST_DIR%\" /Y >nul
            )
        )
    )
)

echo.
echo ==================================================
echo                   PROSES SELESAI!
echo ==================================================
echo 1. Hasil pendataan : %LOG_FILE%
echo 2. Folder gabungan : %DEST_DIR%
echo ==================================================
echo.
pause