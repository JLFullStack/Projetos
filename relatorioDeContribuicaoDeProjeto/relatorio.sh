# Força o console para UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Arquivos externos como bibliotecas e arquivos binários que não entram na contagem de contribuição/eficiência
$arquivosExternos = @(
    "bootstrap", "jquery", "lodash", "moment", "chartjs", "fontawesome", "vendor",
    "d3", "threejs", "axios", "rxjs", "underscore", "tailwind", "babel", "webpack",
    "rollup", "gulp", "grunt", "eslint", "prettier", "png", "jpg", "jpeg", "gif", 
    "bmp", "ico", "pdf", "svg", "ttf", "woff", "woff2", "eot", "mp3", "mp4", "avi", 
    "mov", "zip", "rar", "7z", "node_modules"
)

$autores = @{}

# ===============================
# 1. Coleta de dados históricos do projeto (git log)
# ===============================
$diffs = cmd /c 'git log -U0 --pretty="%aN|%ad|%f" --date=short --encoding=UTF-8' 
$diffs = $diffs -split "`r?`n"
$inDiff = $false

# Conta todas as linhas de autoria
foreach ($linha in $diffs) {
    $linha = $linha.Trim()
    if ($linha -eq "") { continue }

    # Detecta commit
    if ($linha -match "^\S.+\|\d{4}-\d{2}-\d{2}\|") {
        $partes = $linha -split "\|"
        $autorAtual = $partes[0].Trim()
        $dataCommit = [datetime]::Parse($partes[1])
        $arquivoAtual = $partes[2].Trim()
        $inDiff = $true

        # Inicializa autor
        if (-not $autores.ContainsKey($autorAtual)) {
            $autores[$autorAtual] = @{
                commits = 0
                adicoesUteis = 0
                remocoesUteis = 0
                datasCommit = @()
            }
        }

        $autores[$autorAtual].commits += 1
        $autores[$autorAtual].datasCommit += $dataCommit
        continue
    }

    # Ignora arquivos externos
    $ignorarArquivo = $false
    foreach ($lib in $arquivosExternos) {
        if ($arquivoAtual -match "(?i)$lib") {
            $ignorarArquivo = $true
            break
        }
    }
    if ($ignorarArquivo) { continue }

    # Ignora linhas de import ou CDN
    if ($linha -match "^\+.*(import|require|from|<script|@import)") { continue }

    # Linhas adicionadas e removidas
    if ($inDiff -and $linha -match "^\+") {
        if ($linha -notmatch "^\+\s*(//|#|--|\*|\s*$)") {
            $autores[$autorAtual].adicoesUteis += 1
        }
    } elseif ($inDiff -and $linha -match "^\-") {
        if ($linha -notmatch "^\-\s*(//|#|--|\*|\s*$)") {
            $autores[$autorAtual].remocoesUteis += 1
        }
    }
}

# ===============================
# 2. Coleta do estado final do projeto (git blame)
# ===============================
$arquivosProjetoFinal = git ls-tree -r HEAD --name-only

foreach ($arquivo in $arquivosProjetoFinal) {
    # Ignora arquivos externos
    $ignorarArquivo = $false
    foreach ($lib in $arquivosExternos) {
        if ($arquivo -match "(?i)$lib") {
            $ignorarArquivo = $true
            break
        }
    }
    if ($ignorarArquivo) { continue }

    # Processa linhas de autoria
    $linhas = git blame --line-porcelain $arquivo | Select-String "^author "
    $conteudoArquivo = Get-Content -Raw $arquivo -Encoding UTF8 -ErrorAction SilentlyContinue -Force
    $conteudoArquivo = $conteudoArquivo -split "`r?`n"

    for ($i=0; $i -lt $linhas.Count; $i++) {
        # Garante que não estoura índice
        if ($i -ge $conteudoArquivo.Count) { continue }

        $autorAtual = $linhas[$i].ToString().Replace("author ", "").Trim()
        $linhaCodigo = $conteudoArquivo[$i].Trim()

        # Ignora comentários e linhas vazias
        if ($linhaCodigo -match "^(//|#|--|\*|\s*$)") { continue }

        # Ignora imports/CDN
        if ($linhaCodigo -match "^(import|require|from|<script|@import)") { continue }

        # Evita duplicidade: só adiciona se não foi contado em adicoesUteis
        if ($autores.ContainsKey($autorAtual)) {
            $autores[$autorAtual].LinhasAtuais += 1
        }
        else {
            $autores[$autorAtual] = @{ 
                commits = 0
                adicoesUteis = 0
                remocoesUteis = 0
                datasCommit = @()
                LinhasAtuais = 1
            }
        }
    }
}

# ===============================
# 3. Calcula métricas e eficiência
# ===============================
$totalLiquidoHistoricoDoProjeto = 0
$totalLiquidoFinalDoProjeto = 0
#$totalCommits = 0

# Calcula totais globais
foreach ($autor in $autores.Keys) {
    $totalLiquidoHistoricoPorAutor = $autores[$autor].adicoesUteis - $autores[$autor].remocoesUteis
    $totalLiquidoHistoricoDoProjeto += $totalLiquidoHistoricoPorAutor

    $totalLiquidoFinalPorAutor = $autores[$autor].LinhasAtuais
    $totalLiquidoFinalDoProjeto += $totalLiquidoFinalPorAutor

    #$totalCommits += $autores[$autor].commits
}
#$mediaLinhasPorCommitGlobal = if ($totalCommits -gt 0) { $totalLiquidoHistoricoDoProjeto / $totalCommits } else { 1 }

$resultados = @()

foreach ($autor in $autores.Keys) {
    $commits = $autores[$autor].commits
    $adicoes = $autores[$autor].adicoesUteis
    $remocoes = $autores[$autor].remocoesUteis
    $totalLiquidoHistoricoPorAutor = $adicoes - $remocoes
    $totalLiquidoFinalPorAutor = $autores[$autor].LinhasAtuais

    $datas = $autores[$autor].datasCommit | Sort-Object
    if ($datas -and $datas.Count -gt 0) {
        $primeiroCommit = $datas[0]
        $ultimoCommit   = $datas[-1]
    } else {
        # Se não houver datas, define como vazio ou data padrão
        $primeiroCommit = [datetime]::MinValue
        $ultimoCommit   = [datetime]::MinValue
    }

    # Percentuais de contribuição 
    $PercentualContribuicaoHistorica = if ($totalLiquidoHistoricoDoProjeto -gt 0) { 
        [math]::Round(($totalLiquidoHistoricoPorAutor / $totalLiquidoHistoricoDoProjeto) * 100, 2) 
    } 
    else { 0 }
    
    $PercentualContribuicaoFinal = if ($totalLiquidoFinalDoProjeto -gt 0) { 
        [math]::Round(($totalLiquidoFinalPorAutor / $totalLiquidoFinalDoProjeto) * 100, 2) 
    } 
    else { 0 }

    $resultados += [PSCustomObject]@{
        Usuario = $autor
        Commits = $commits
        PrimeiroCommit = if ($primeiroCommit -eq [datetime]::MinValue) { "Sem commit" } else { $primeiroCommit.ToShortDateString() }
        UltimoCommit   = if ($ultimoCommit   -eq [datetime]::MinValue) { "Sem commit" } else { $ultimoCommit.ToShortDateString() }
        LinhasAdicionadasUteis = $adicoes
        LinhasRemovidasUteis = $remocoes
        TotalLiquidoUteisHistorico = $totalLiquidoHistoricoPorAutor
        TotalLiquidoUteisFinal = $totalLiquidoFinalPorAutor
        PercentualContribuicaoHistorica = $PercentualContribuicaoHistorica
        PercentualContribuicaoFinal = $PercentualContribuicaoFinal
    }
}

# ===============================
# 4. Layout
# ===============================
$resultados | Sort-Object -Property PercentualContribuicaoFinal -Descending | Format-Table -AutoSize

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Windows.Forms.DataVisualization

$formulario = New-Object System.Windows.Forms.Form
$formulario.Text = "Relatório de Contribuição de Projeto"
$formulario.WindowState = "Maximized"

$pastaProjeto = (git rev-parse --show-toplevel 2>$null | Out-String).Trim()

if ([string]::IsNullOrWhiteSpace($pastaProjeto)) {
    $nomeProjeto = "Projeto Desconhecido"
} else {
    $nomeProjeto = Split-Path $pastaProjeto -Leaf
}

$dataUltimoGit = (cmd /c 'git log -1 --date=short --pretty=format:"%ad"' 2>$null).Trim()
if (-not $dataUltimoGit) {
    $dataUltimoGit = (Get-Date).ToString("yyyy-MM-dd")
}

try {
    $ultimaDataCommit = [datetime]::ParseExact($dataUltimoGit, "yyyy-MM-dd", $null).ToString("dd/MM/yyyy")
} catch {
    $ultimaDataCommit = (Get-Date).ToString("dd/MM/yyyy")
}

# Barra superior
$gridTopo = New-Object System.Windows.Forms.Panel
$gridTopo.Dock = "Top"
$gridTopo.Height = 60
$formulario.Controls.Add($gridTopo)

$icone = New-Object System.Windows.Forms.PictureBox
$icone.Image = [System.Drawing.SystemIcons]::Information.ToBitmap()
$icone.SizeMode = "StretchImage"
$icone.Width = 32
$icone.Height = 32
$icone.Top = ($gridTopo.Height - $icone.Height)/2
$icone.Left = 10
$gridTopo.Controls.Add($icone)

$mensagemResumo = @"
A Posição gráfica é baseada no percentual de contribuição final de cada autor, 
ou seja, a fatia de código útil que cada pessoa mantém no projeto hoje. 

São contadas apenas linhas de código úteis:
	- Linhas de código externas ou imports/CDNs são ignoradas. 
	- Linhas de comentário ou vazias não contam.

- Commits: quantas entregas de código a pessoa fez.
- Período de contribuição: mostra o período em que o autor esteve ativo no projeto, desde o primeiro ao último commit.

DADOS HISTÓRICOS (tudo que já foi feito):
- Linhas adicionadas/removidas: mudanças úteis feitas no passado.
- Total líquido histórico: saldo final (adicionadas - removidas).
- Percentual histórico: quanto representou do total de mudanças já feitas.

DADOS FINAIS (código que ficou no projeto hoje):
- Total líquido final: linhas úteis que ainda permanecem no sistema.
- Percentual final: participação atual da pessoa no projeto.

Em resumo: o histórico mostra o caminho de cada autor, 
e os dados finais mostram o que ficou no projeto.
"@

$icone.Add_Click({$mensagemResumo
    [System.Windows.Forms.MessageBox]::Show($mensagemResumo, "SUMÁRIO DO CÁLCULO", [System.Windows.Forms.MessageBoxButtons]::OK, [System.Windows.Forms.MessageBoxIcon]::Information)
})

# Descrição do projeto
$labelProjeto = New-Object System.Windows.Forms.Label
$labelProjeto.Text = "Projeto: $nomeProjeto | Versão: $ultimaDataCommit"
$labelProjeto.Font = New-Object System.Drawing.Font("Arial", 15, [System.Drawing.FontStyle]::Bold)
$labelProjeto.AutoSize = $false
$labelProjeto.TextAlign = "MiddleCenter"
$labelProjeto.Dock = "Fill"
$gridTopo.Controls.Add($labelProjeto)

$tooltip = New-Object System.Windows.Forms.ToolTip
$tooltip.IsBalloon = $true
$tooltip.ToolTipTitle = "SUMÁRIO DO CÁLCULO"
$tooltip.ShowAlways = $true
$tooltip.UseFading = $false
$tooltip.UseAnimation = $false
$tooltip.AutoPopDelay = 86400000
$tooltip.InitialDelay = 200
$tooltip.ReshowDelay = 100
$tooltip.SetToolTip($icone, $mensagemResumo)

# ===============================
# 5. Gráfico
# ===============================
$grafico = New-Object System.Windows.Forms.DataVisualization.Charting.Chart
$grafico.Dock = "Fill"
$areaGrafica = New-Object System.Windows.Forms.DataVisualization.Charting.ChartArea

$areaGrafica.AxisX.Title = "Autores"
$areaGrafica.AxisX.MajorGrid.Enabled = $false
$areaGrafica.AxisX.LabelStyle.Angle = -45
$areaGrafica.AxisX.LabelStyle.IsStaggered = $true
$areaGrafica.AxisX.Interval = 1
$areaGrafica.AxisX.LabelStyle.Font = New-Object System.Drawing.Font("Arial", 8)

$areaGrafica.AxisY.Title = "Percentual de Contribuição Final (%)"
$areaGrafica.AxisY.Interval = 5
$areaGrafica.AxisY.IsReversed = $false
$areaGrafica.AxisY.MajorGrid.Enabled = $false
$grafico.ChartAreas.Add($areaGrafica)

# Linha vertical no eixo Y
$linha = New-Object System.Windows.Forms.DataVisualization.Charting.StripLine
$linha.Interval = 0
$linha.IntervalOffset = 0
$linha.StripWidth = 0.01
$linha.BackColor = [System.Drawing.Color]::Black
$areaGrafica.AxisY.StripLines.Add($linha)

$series = New-Object System.Windows.Forms.DataVisualization.Charting.Series
$series.Name = "Contribuicao"
$series.ChartType = [System.Windows.Forms.DataVisualization.Charting.SeriesChartType]::Bar
$series.IsValueShownAsLabel = $true
$series.LabelForeColor = 'Black'

$cores = @(
    'Green','Red','DarkOrange','Brown','Purple','Cyan','Magenta','DarkGoldenrod','DarkTurquoise','DarkViolet',
    'Blue','DarkBlue','Yellow','Gray','Black','Pink','Silver','DarkGreen','DarkRed','LightBlue',
    'LightGreen','LightCoral','Gold','Indigo','Olive','Teal','SlateBlue','Tomato','Chocolate','Orchid'
)

$resultadosOrdenados = $resultados | Sort-Object -Property PercentualContribuicaoFinal

$i = 0
foreach ($autor in $resultadosOrdenados) {
    $pontos = $series.Points.Add($autor.PercentualContribuicaoFinal)
    $series.Points[$i].AxisLabel = $autor.Usuario
    $series.Points[$i].Label = "$($autor.PercentualContribuicaoFinal)%"
    $indiceCor = $i % $cores.Count
	$series.Points[$i].Color = $cores[$indiceCor]
    $series.Points[$i].ToolTip = @"
Usuário: $($autor.Usuario)
Commits: $($autor.Commits)
Período de contribuição: De $($autor.PrimeiroCommit) a $($autor.UltimoCommit)

Dados Históricos:
Linhas adicionadas: $($autor.LinhasAdicionadasUteis)
Linhas removidas: $($autor.LinhasRemovidasUteis)
Total líquido histórico de linhas úteis: $($autor.TotalLiquidoUteisHistorico)
Percentual de contribuição histórica: $($autor.PercentualContribuicaoHistorica)%

Dados Finais:
Total líquido final de linhas úteis: $($autor.TotalLiquidoUteisFinal)
Percentual de contribuição final: $($autor.PercentualContribuicaoFinal)%
"@
    $i++
}

$grafico.Series.Add($series)
$formulario.Controls.Add($grafico)
$formulario.Add_Shown({$formulario.Activate()})
[void]$formulario.ShowDialog()
