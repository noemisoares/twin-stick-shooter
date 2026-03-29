# Trial of the Four Elements

## Alunos
Gabriel de Souza Leão Araújo
Noemi Soares Gonçalves da Silva

## Tecnologias Utilizadas
1. **HTML5**
2. **CSS3**
3. **JavaScript**
4. **Canvas API (2D Rendering)**
5. **Programação Orientada a Objetos**
6. **Game Loop com requestAnimationFrame**
7. **Matemática aplicada a jogos (trigonometria + vetores)**

## Tema Escolhido
O jogo é um minigame estilo "Sobrevivência de Arena" (baseado em Journey of the Prairie King de Stardew Valley), adaptado para um tema mágico onde o jogador é um mago em uma Dungeon que deve enfrentar 4 inimigos elementais (Terra, Fogo, Água e Ar).

## Critérios de Avaliação Atendidos (Transformações Utilizadas)

### Obrigatórios (Numerados de 1 a 7 estritamente como na rubrica):
1. **Translação (`ctx.translate`)**: Aplicada a todos os elementos móveis da cena para reposicionar a origem antes de desenhar (Jogador, Projéteis, Inimigos da Terra e Água).
2. **Rotação (`ctx.rotate`)**: Integrada na Varinha (que rotaciona perfeitamente em direção à mira do mouse) e no inimigo de Fogo (que rotaciona para encarar a movimentação em tempo real do Mago).
3. **Escala (`ctx.scale`)**: Implementada para aplicar um efeito pulsante natural à joia na ponta da varinha do Mago utilizando `Math.sin(tempo)`.
4. **Composição de Transformações**: Empregada fortemente no comportamento do Tufão (Ar), combinando a sequência matemática exata ensinada em aula de `T_origem * R_orbita * T_distancia * R_propria` para fazer ele girar simultaneamente no próprio eixo e ao longo da dungeon inteira, aproximando-se fatalmente.
5. **Rotação/Escala com Ponto Fixo (T -> Op -> T)**: Foi usado no sistema Mago > Varinha > Joia. Nós transladamos até a posição, aplicamos a Rotação da Varinha de acordo com o Mago, transladamos a varinha com tamanho 22 de distância, e em seguida um novo `scale()` na joia para criar com perfeição sem distorcer o sistema de plano. O eixo é completamente protegido.
6. **Animação**: Funcional com uso consistente de `requestAnimationFrame` em um _game loop_ infinito. Uma chamada de segurança `ctx.setTransform(1, 0, 0, 1, 0, 0)` na primeira linha do loop garante o esvaziamento adequado da herança da matriz anterior a cada frame.
7. **save/restore (pilhas de estados)**: Empurrados estrategicamente à toda chamada baseada em função `draw()` garantindo coesão absoluta nas hierarquias. 

### Diferenciais / Bônus Atendidos e Marcados:
- **Interatividade**: Listener reativo `keydown/keyup` com chaves lógicas de controle de estado em `WASD` permitindo controle absoluto cinético contínuo do mago em união com a reatividade do tracking do cursor.
- **Reflexão**: Uso do `scale(-1, 1)` invertendo instantaneamente o `X` do corpo do personagem caso ele mire para o quadrante em que o valor local do `mouse.x < player.x`.
- **Hierarquia de Transformações**: Sistema Mago > Varinha > Joia Mágica. Como o código usa a cascata linear do `ctx.save()`, toda manipulação de dimensão ou espelhamento feito no mago afeta perfeitamente e geometricamente o local renderizado da espada e do seu brilho terminal sem conflitos.
