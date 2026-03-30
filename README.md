# Trial of the Four Elements

## ♞ Equipe:
- **Gabriel de Souza Leão Araújo**  
- **Noemi Soares Gonçalves da Silva**

---
## Tema Escolhido
O jogo é um minigame no estilo *arena survival*, inspirado em *Journey of the Prairie King* (de *Stardew Valley*), adaptado para um tema mágico onde o jogador assume o papel de um mago preso em uma dungeon, enfrentando inimigos elementais — **Terra, Fogo, Água e Ar** — cada um com comportamentos únicos baseados em transformações geométricas e lógica matemática.

O foco do projeto é demonstrar, na prática, o uso avançado da **API Canvas 2D**, com ênfase em transformações, animação e hierarquia de objetos.

---

## Tecnologias Utilizadas
- HTML5
- CSS3
- JavaScript
- Canvas API (Renderização 2D)
- Programação Orientada a Objetos (POO)
- Game Loop com `requestAnimationFrame`
- Matemática aplicada a jogos (Trigonometria + Vetores)

---

## Critérios de Avaliação Atendidos (Transformações Utilizadas)

### Obrigatórios (Numerados de 1 a 7 estritamente como na rubrica):
1. **Translação (`ctx.translate`)**: Aplicada a todos os elementos móveis da cena para reposicionar a origem antes de desenhar (Jogador, Projéteis, Inimigos da Terra e Água).
2. **Rotação (`ctx.rotate`)**: Integrada na Varinha (que rotaciona perfeitamente em direção à mira do mouse) e no inimigo de Fogo (que rotaciona para encarar a movimentação em tempo real do Mago).
3. **Escala (`ctx.scale`)**: Implementada para aplicar um efeito pulsante natural à magia na ponta da varinha do Mago utilizando `Math.sin(tempo)`.
4. **Composição de Transformações**: Empregada fortemente no comportamento do Ar, combinando a sequência matemática exata ensinada em aula de `T_origem * R_orbita * T_distancia * R_propria` para fazer ele girar simultaneamente no próprio eixo e ao longo da dungeon inteira, aproximando-se fatalmente.
5. **Rotação/Escala com Ponto Fixo (T -> Op -> T)**: Foi usado no sistema Mago > Varinha > Magia. Nós transladamos até a posição, aplicamos a Rotação da Varinha de acordo com o Mago, transladamos a varinha com tamanho 22 de distância, e em seguida um novo `scale()` na joia para criar com perfeição sem distorcer o sistema de plano. O eixo é completamente protegido.
6. **Animação**: Funcional com uso consistente de `requestAnimationFrame` em um _game loop_ infinito. Uma chamada de segurança `ctx.setTransform(1, 0, 0, 1, 0, 0)` na primeira linha do loop garante o esvaziamento adequado da herança da matriz anterior a cada frame.
7. **save/restore (pilhas de estados)**: Empurrados estrategicamente à toda chamada baseada em função `draw()` garantindo coesão absoluta nas hierarquias. 

### Diferenciais / Bônus Atendidos e Marcados:
- **Interatividade**: Listener reativo `keydown/keyup` com chaves lógicas de controle de estado em `WASD` permitindo controle absoluto cinético contínuo do mago em união com a reatividade do tracking do cursor.
- **Reflexão**: Uso do `scale(-1, 1)` invertendo instantaneamente o `X` do corpo do personagem caso ele mire para o quadrante em que o valor local do `mouse.x < player.x`.
- **Hierarquia de Transformações**: Sistema Mago > Varinha > Mágica. Como o código usa a cascata linear do `ctx.save()`, toda manipulação de dimensão ou espelhamento feito no mago afeta perfeitamente e geometricamente o local renderizado da varinha e do seu brilho terminal sem conflitos.
