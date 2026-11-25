// =====================================================================
//  MdP · biblioteca.js — fichas de serie («Sugerida por MdP»)
//  Solo teoría: el ejemplo en el tablero lo crea el alumno.
//  Cada ficha aparece cuando su tema está activo, translúcida hasta
//  que se le añade un ejemplo propio. Textos propios de MdP.
//  Tanda 1 · Táctica (18 fichas)
//  Tanda 2 · Estructuras de peones (17 fichas)
// =====================================================================
export const BIBLIOTECA_VERSION = '2';

export const BIBLIOTECA = [
  // ================================================================
  //  TÁCTICA (tanda 1)
  // ================================================================

  // ------------------------------------------------ Motivos tácticos
  {
    id: 'tac-clavada', bloque: 'Táctica', tema: 'Motivos tácticos',
    titulo: 'Clavada', en: 'Pin', lichess: 'pin', alias: ['clavado', 'clavada absoluta', 'clavada relativa'],
    def: 'Una pieza no puede moverse sin dejar expuesta a otra más valiosa que tiene detrás.',
    principio: 'La pieza clavada es una pieza paralizada: atácala otra vez.',
    explicacion: `Una pieza de largo alcance (alfil, torre o dama) ataca a una pieza que tiene detrás, en la misma línea, otra más valiosa.
- **Clavada absoluta**: detrás está el rey. La pieza clavada no puede moverse legalmente.
- **Clavada relativa**: detrás hay otra pieza valiosa (la dama, una torre). Puede moverse, pero se pierde material.
**Cómo aprovecharla**: ataca a la pieza clavada con un peón o con otra pieza; como no puede escapar, suele caer.
**Cómo defenderte**: interpón otra pieza, aparta lo que hay detrás o ataca a la pieza que clava.`,
    pista: 'Coloca un alfil que clave un caballo contra el rey o la dama, y un peón tuyo que pueda atacar a ese caballo.',
  },
  {
    id: 'tac-enfilada', bloque: 'Táctica', tema: 'Motivos tácticos',
    titulo: 'Enfilada', en: 'Skewer', lichess: 'skewer', alias: [],
    def: 'Ataque en línea a una pieza valiosa que, al apartarse, deja indefensa a la que tiene detrás.',
    principio: 'Es una clavada al revés: la pieza valiosa va delante y, al apartarse, deja caer la de detrás.',
    explicacion: `Una pieza de largo alcance ataca en línea a una pieza valiosa que tiene otra detrás. La de delante tiene que apartarse (muchas veces porque es el rey y está en jaque) y la de detrás queda indefensa.
- Es muy típica con el rey delante y la dama o una torre detrás.
- Aparece mucho en las diagonales largas y en los finales de torres.
**Diferencia con la clavada**: en la clavada, la pieza más valiosa está detrás; en la enfilada, delante.
**Cómo evitarla**: no dejes tu rey y otra pieza importante en la misma línea abierta, y vigila los jaques largos del rival.`,
    pista: 'Busca una posición con el rey y la dama rivales en la misma diagonal o columna, y una pieza tuya que pueda dar jaque por esa línea.',
  },
  {
    id: 'tac-ataque-doble', bloque: 'Táctica', tema: 'Motivos tácticos',
    titulo: 'Ataque doble', en: 'Fork', lichess: 'fork', alias: ['horquilla', 'doble ataque'],
    def: 'Una sola pieza ataca a la vez dos objetivos. Con caballo se llama horquilla.',
    principio: 'Una jugada, dos amenazas: el rival solo puede atender una.',
    explicacion: `Una sola pieza ataca a la vez dos (o más) objetivos: piezas indefensas, piezas de más valor que la atacante, el rey o una casilla de mate.
- Con el caballo se llama **horquilla**, y es especialmente traicionera porque sus ataques se ven peor.
- Peones y dama también hacen ataques dobles con mucha frecuencia.
- Es más fuerte si una de las amenazas es un **jaque**: el rival no tiene tiempo de salvar lo otro.
**Cómo prevenirlo**: vigila las casillas desde las que un caballo enemigo atacaría dos piezas tuyas, y no dejes piezas sin defensa.`,
    pista: 'Coloca un caballo que pueda saltar a una casilla desde la que dé jaque al rey y ataque a la vez a la dama o a una torre.',
  },
  {
    id: 'tac-descubierta', bloque: 'Táctica', tema: 'Motivos tácticos',
    titulo: 'Ataque a la descubierta', en: 'Discovered attack', lichess: 'discoveredAttack',
    alias: ['ataque descubierto', 'jaque a la descubierta', 'descubierta'],
    def: 'Una pieza se mueve y destapa el ataque de otra pieza propia que estaba detrás.',
    principio: 'Mueves la pieza de delante y ataca la de detrás: dos golpes en una sola jugada.',
    explicacion: `Dos piezas propias están en la misma línea: una de largo alcance detrás y otra delante que le tapa el camino. Al mover la de delante, se **descubre** el ataque de la de detrás.
- La fuerza está en que la pieza que se mueve puede crear **otra amenaza** al mismo tiempo: capturar, atacar otra pieza o dar jaque.
- Si lo que se descubre es un jaque, se llama **jaque a la descubierta**, uno de los recursos más fuertes del ajedrez.
**Cómo detectarlo**: fíjate en las piezas que están delante de las torres, alfiles o dama, apuntando hacia un rey o una dama.`,
    pista: 'Pon un alfil detrás de un caballo propio, apuntando a la dama rival, y busca la jugada de caballo que además amenace algo.',
  },
  {
    id: 'tac-jaque-doble', bloque: 'Táctica', tema: 'Motivos tácticos',
    titulo: 'Jaque doble', en: 'Double check', lichess: 'doubleCheck', alias: [],
    def: 'Jaque de dos piezas a la vez: la única defensa es mover el rey.',
    principio: 'Contra un jaque doble solo vale mover el rey.',
    explicacion: `Es un caso especial del jaque a la descubierta en el que **dan jaque las dos piezas a la vez**: la que se mueve y la que queda descubierta.
- No se puede capturar a las dos ni tapar dos líneas en una sola jugada, así que **la única defensa es mover el rey**.
- Por eso permite sacrificios espectaculares: aunque la pieza que da jaque esté atacada, el rival no puede capturarla.
- Está detrás de muchos mates, como el mate de la coz.`,
    pista: 'Coloca una torre y un alfil propios apuntando al rey rival, uno tapando al otro, y busca la jugada que deje a los dos dando jaque.',
  },
  {
    id: 'tac-rayos-x', bloque: 'Táctica', tema: 'Motivos tácticos',
    titulo: 'Rayos X', en: 'X-ray', lichess: 'xRayAttack', alias: [],
    def: 'Una pieza ataca o defiende a través de otra pieza que está en medio.',
    principio: 'Una pieza sigue actuando a través de la que tiene delante.',
    explicacion: `Una pieza de largo alcance ataca o defiende una casilla **a través** de otra pieza que se interpone, propia o contraria.
- **Rayos X defensivos**: una torre defiende una casilla a través de la torre o la dama rival; tras los cambios en esa línea, la casilla sigue defendida.
- **Rayos X ofensivos**: al doblar torres o poner la dama detrás de una torre, cuando se cambia la primera, la segunda llega a la casilla clave.
**Para qué sirve**: para contar bien atacantes y defensores. Una pieza «tapada» también cuenta si los cambios la destapan.`,
    pista: 'Monta una columna con tus dos torres dobladas frente a una torre rival y cuenta qué queda tras los cambios.',
  },

  // ------------------------------------------------ Piezas desprotegidas
  {
    id: 'tac-colgada', bloque: 'Táctica', tema: 'Piezas desprotegidas',
    titulo: 'Pieza colgada', en: 'Hanging piece', lichess: 'hangingPiece', alias: ['colgada', 'colgado', 'piezas colgadas'],
    def: 'Pieza atacada y sin defensa suficiente: se puede capturar gratis.',
    principio: 'Antes de cada jugada: ¿qué piezas están colgadas, mías y suyas?',
    explicacion: `Una pieza colgada es una pieza atacada que no está defendida (o no lo suficiente) y que se puede capturar sin perder nada.
- Es el error más frecuente en todos los niveles: muchísimas partidas se deciden por una pieza que se deja colgada.
- También está en peligro la pieza defendida pero **atacada por otra de menos valor** (una torre atacada por un caballo).
**Hábito**: tras cada jugada del rival, mira qué ataca; antes de cada jugada tuya, mira qué dejas sin defensa.`,
    pista: 'Monta una posición en la que, tras su última jugada, una pieza rival haya quedado atacada y sin defensa.',
  },
  {
    id: 'tac-desprotegidas', bloque: 'Táctica', tema: 'Piezas desprotegidas',
    titulo: 'Piezas desprotegidas', en: 'Loose pieces', lichess: 'hangingPiece',
    alias: ['pieza desprotegida', 'desprotegida', 'desprotegidas', 'piezas sueltas', 'pieza suelta'],
    def: 'Piezas sin ninguna defensa, aunque nadie las ataque todavía: blancos naturales de la táctica.',
    principio: 'Pieza desprotegida, pieza en peligro: casi toda la táctica empieza aquí.',
    explicacion: `Una pieza desprotegida es la que no tiene ninguna defensa, aunque ahora mismo nadie la ataque. No es un error todavía, pero es un **objetivo**: casi todos los ataques dobles, enfiladas y descubiertas buscan piezas desprotegidas.
- Cuantas más piezas desprotegidas tengas, más táctica tendrá a mano tu rival.
- En el medio juego conviene que tus piezas se defiendan entre sí.
**Hábito**: localiza las piezas desprotegidas de los dos bandos. Los ingleses lo resumen así: *las piezas sueltas se caen*.`,
    pista: 'Monta una posición con dos piezas rivales sin defensa y busca la jugada que ataque a las dos a la vez.',
  },
  {
    id: 'tac-encubierta', bloque: 'Táctica', tema: 'Piezas desprotegidas',
    titulo: 'Desprotegida encubierta', en: 'Falsely defended piece', lichess: 'capturingDefender',
    alias: ['desprotegidas encubiertas', 'defensa aparente', 'falsa defensa'],
    def: 'Pieza que parece defendida, pero cuyo defensor no puede o no debe recapturar.',
    principio: 'Que una pieza tenga un defensor no significa que esté defendida.',
    explicacion: `Es una pieza que **parece defendida, pero su defensa no funciona**. A simple vista está protegida; en realidad está tan expuesta como una pieza colgada.
- El defensor está **clavado** y no puede capturar.
- El defensor está **sobrecargado**: ya defiende otra cosa importante.
- Al recapturar, el defensor **deja algo peor** al descubierto: una casilla de mate, otra pieza o su rey.
- La captura llega **con jaque** o con otra amenaza mayor, y no hay tiempo de recapturar.
**Hábito**: no cuentes solo defensores; comprueba si de verdad pueden defender.`,
    pista: 'Monta una posición en la que una pieza rival esté defendida solo por otra que está clavada contra su rey.',
  },
  {
    id: 'tac-atrapada', bloque: 'Táctica', tema: 'Piezas desprotegidas',
    titulo: 'Pieza atrapada', en: 'Trapped piece', lichess: 'trappedPiece', alias: ['atrapada', 'pieza encerrada'],
    def: 'Pieza sin casillas seguras a las que huir: si la atacan, se pierde.',
    principio: 'Una pieza sin casillas de escape se puede cazar.',
    explicacion: `Una pieza está atrapada cuando no tiene casillas seguras a las que ir: si la atacan, se pierde aunque no esté clavada.
- Un clásico: el alfil que captura el peón de a7 (o de a2) y queda encerrado tras …b6 (o b3).
- También el caballo en el borde del tablero o la dama que se adentra a comer peones lejanos.
- Las piezas en el borde y en campo enemigo son las más fáciles de atrapar.
**Hábito**: antes de meter una pieza en terreno enemigo, comprueba por dónde saldría.`,
    pista: 'Coloca un alfil blanco que acabe de capturar el peón de a7 y busca la jugada de peón negro que lo deja sin salida.',
  },

  // ------------------------------------------------ Mecanismos de combinación
  {
    id: 'tac-desviacion', bloque: 'Táctica', tema: 'Mecanismos de combinación',
    titulo: 'Desviación', en: 'Deflection', lichess: 'deflection', alias: ['desviar'],
    def: 'Obligar a una pieza defensora a abandonar la casilla o línea que defiende.',
    principio: 'Si un defensor estorba, apártalo.',
    explicacion: `Obligar a una pieza enemiga a abandonar una casilla o una línea donde cumple una función defensiva importante.
- Se hace con un **sacrificio** o una **amenaza** que no puede ignorar: un jaque, una captura que hay que devolver, un ataque a una pieza mayor.
- En cuanto el defensor se va, aparece la táctica: mate en la última fila, una pieza que cae, un peón que corona.
**Pregunta clave**: ¿qué pieza rival sostiene toda su posición? Esa es la que hay que desviar.`,
    pista: 'Busca una posición en la que una torre rival defienda su última fila y otra pieza tuya pueda obligarla a abandonarla.',
  },
  {
    id: 'tac-atraccion', bloque: 'Táctica', tema: 'Mecanismos de combinación',
    titulo: 'Atracción', en: 'Attraction (decoy)', lichess: 'attraction', alias: ['atraer'],
    def: 'Obligar a una pieza enemiga a ir a una casilla donde será víctima de una táctica.',
    principio: 'Lleva a la pieza enemiga a la casilla donde tú la quieres.',
    explicacion: `Obligar a una pieza del rival, a menudo el rey o la dama, a ir a una casilla concreta donde quedará expuesta a una táctica.
- Casi siempre se hace con un **sacrificio** que hay que aceptar.
- Ejemplos: atraer al rey a una casilla donde recibe un jaque doble; atraer a la dama a una casilla donde sufre una horquilla o una enfilada.
**Diferencia con la desviación**: en la desviación sacas a la pieza de donde está; en la atracción, la llevas adonde tú quieres.`,
    pista: 'Busca un sacrificio que obligue al rey rival a ir a una casilla desde la que tu caballo le dé jaque atacando a la vez a la dama.',
  },
  {
    id: 'tac-sobrecarga', bloque: 'Táctica', tema: 'Mecanismos de combinación',
    titulo: 'Sobrecarga', en: 'Overloading', lichess: 'deflection', alias: ['sobrecargada', 'sobrecargado', 'pieza sobrecargada'],
    def: 'Una pieza tiene demasiadas tareas defensivas a la vez y no puede cumplirlas todas.',
    principio: 'Una pieza no puede hacer dos trabajos a la vez.',
    explicacion: `Una pieza defensora está sobrecargada cuando tiene **dos o más tareas** a la vez: defender dos piezas, o una pieza y una casilla de mate.
- Si la obligas a cumplir una tarea, abandona la otra.
- Casi siempre se combina con la desviación: amenazas o capturas una de las cosas que defiende y, al responder, deja caer la otra.
**Cómo detectarla**: para cada defensor del rival, pregúntate «¿qué está defendiendo?». Si la respuesta tiene dos cosas, hay táctica.`,
    pista: 'Coloca una dama rival que defienda a la vez una torre y la casilla de mate de su rey.',
  },
  {
    id: 'tac-eliminacion', bloque: 'Táctica', tema: 'Mecanismos de combinación',
    titulo: 'Eliminación del defensor', en: 'Removing the defender', lichess: 'capturingDefender',
    alias: ['eliminar al defensor', 'eliminación de la defensa'],
    def: 'Capturar o cambiar la pieza que protege algo importante para ganarlo después.',
    principio: 'Captura al que defiende y lo defendido caerá.',
    explicacion: `Capturar o cambiar la pieza que protege una casilla o una pieza importante, para conseguir después esa casilla o esa pieza.
- A menudo se entrega material: una torre por el caballo que defendía el mate, y después mate.
- Se parece a la desviación, pero aquí el defensor no se aparta: **desaparece**.
**Pregunta clave**: ¿qué pieza impide mi táctica? ¿La puedo capturar, aunque me cueste material?`,
    pista: 'Monta una posición en la que un caballo rival sea lo único que impide un mate, y una pieza tuya pueda capturarlo.',
  },
  {
    id: 'tac-interferencia', bloque: 'Táctica', tema: 'Mecanismos de combinación',
    titulo: 'Interferencia', en: 'Interference', lichess: 'interference', alias: [],
    def: 'Interponer una pieza para cortar la defensa entre dos piezas contrarias.',
    principio: 'Corta la línea entre el defensor y lo que defiende.',
    explicacion: `Colocar una pieza en una casilla que **interrumpe la línea** entre una pieza defensora del rival y lo que defiende.
- Funciona contra piezas de largo alcance (torres, alfiles, dama) que defienden a distancia.
- Muchas veces la pieza que se interpone se sacrifica: si la capturan, la defensa se rompe igualmente.
**Típico**: dos piezas rivales que se protegen por la misma línea; una pieza tuya se mete en medio.`,
    pista: 'Monta una posición con dos torres rivales que se defienden por la última fila, y busca la casilla donde interponer una pieza tuya.',
  },
  {
    id: 'tac-despeje', bloque: 'Táctica', tema: 'Mecanismos de combinación',
    titulo: 'Despeje', en: 'Clearance', lichess: 'clearance', alias: ['despeje de línea', 'despeje de casilla'],
    def: 'Apartar (a menudo sacrificando) una pieza propia para dejar libre una casilla o una línea.',
    principio: 'A veces la mejor jugada es quitarse de en medio.',
    explicacion: `Mover, a menudo sacrificando, una pieza propia para **dejar libre** una casilla, una columna o una diagonal que necesita otra pieza tuya.
- **Despeje de casilla**: la pieza ocupa justo la casilla donde otra daría mate o un ataque doble.
- **Despeje de línea**: la pieza tapa la columna o la diagonal de una torre, un alfil o la dama.
- Se suele hacer con amenaza (jaque o captura) para no dar tiempo al rival.`,
    pista: 'Coloca una pieza tuya tapando la diagonal de tu alfil hacia el rey rival y busca cómo apartarla con ganancia de tiempo.',
  },
  {
    id: 'tac-intermedia', bloque: 'Táctica', tema: 'Mecanismos de combinación',
    titulo: 'Jugada intermedia', en: 'Intermezzo (zwischenzug)', lichess: 'intermezzo', alias: ['intermezzo', 'zwischenzug'],
    def: 'Una jugada con amenaza intercalada antes de la respuesta que parecía obligada.',
    principio: 'Antes de lo «obligado», mira si hay algo mejor.',
    explicacion: `En lugar de hacer la jugada que parece forzada (normalmente recapturar), se intercala **otra jugada con una amenaza más fuerte**: un jaque, una captura o un ataque a una pieza mayor.
- El rival tiene que responder y, después, haces la jugada que esperaba, en mejores condiciones.
- También sirve para defender: ante un ataque, una jugada intermedia puede cambiar el resultado de los cambios.
**Hábito**: antes de recapturar en automático, revisa jaques, capturas y amenazas.`,
    pista: 'Monta un cambio de piezas en el que, antes de recapturar, puedas dar un jaque que gane material.',
  },
  {
    id: 'tac-molino', bloque: 'Táctica', tema: 'Mecanismos de combinación',
    titulo: 'Molino', en: 'Windmill', lichess: 'discoveredAttack', alias: [],
    def: 'Serie de jaques a la descubierta seguidos que van ganando material en cada vuelta.',
    principio: 'Jaque, captura, jaque, captura: la descubierta que se repite.',
    explicacion: `Una serie de **jaques a la descubierta** seguidos: una pieza (normalmente una torre) va y viene dando jaques descubiertos y, en cada ida o vuelta, captura material.
- La pareja típica es torre más alfil: el alfil da jaque cada vez que la torre se mueve.
- El rey rival solo puede moverse entre dos casillas, así que no puede romper el mecanismo.
- El ejemplo más famoso es la partida Torre–Lasker, Moscú 1925.`,
    pista: 'Coloca tu torre en la séptima fila y tu alfil apuntando al rey rival, de forma que la torre tape el jaque del alfil.',
  },
  // ================================================================
  //  ESTRUCTURAS DE PEONES (tanda 2)
  // ================================================================

  // ------------------------------------------------ Debilidades de peones
  {
    id: 'est-aislado', bloque: 'Estructuras de peones', tema: 'Debilidades de peones',
    titulo: 'Peón aislado', en: 'Isolated pawn', lichess: '', alias: ['peones aislados', 'aislado'],
    def: 'Peón sin peones propios en las columnas vecinas: ningún peón puede defenderlo.',
    principio: 'Un peón aislado solo puede defenderse con piezas, y eso las ata.',
    explicacion: `Un peón está aislado cuando no hay peones propios en las columnas de al lado. Ningún peón puede protegerlo, así que tienen que hacerlo las piezas.
- **La casilla de delante** es un buen puesto para el rival: ningún peón puede echar a la pieza que se instale allí.
- Es un **objetivo** fácil de atacar, sobre todo en columnas abiertas o semiabiertas.
- Cuantas menos piezas quedan en el tablero, más débil se vuelve: en los finales suele ser una desventaja clara.
**No siempre es malo**: a cambio suele dar columnas abiertas y juego activo a las piezas.`,
    pista: 'Monta una estructura con un peón aislado en la columna c o e y una pieza rival bien instalada en la casilla de delante.',
  },
  {
    id: 'est-aislado-central', bloque: 'Estructuras de peones', tema: 'Debilidades de peones',
    titulo: 'Peón aislado central', en: 'Isolated queen’s pawn (IQP)', lichess: '', alias: ['peón de dama aislado', 'IQP'],
    def: 'Peón aislado en la columna d (d4 o d5): fuerza dinámica en el medio juego, debilidad en el final.',
    principio: 'Con el peón aislado, busca el ataque; contra él, bloquea y cambia piezas.',
    explicacion: `Es el peón aislado más famoso: un peón en **d4** (o d5) sin peones en las columnas c y e. Sale en muchas aperturas (Gambito de dama, Caro-Kann, Nimzoindia, Siciliana Alapin…).
**Para quien lo tiene**:
- Da espacio y dos casillas fuertes para los caballos (e5 y c5).
- Las columnas c y e quedan abiertas para las torres.
- El plan es **atacar**, a menudo sobre el enroque rival, y preparar la ruptura **d4-d5** en el momento justo.
**Para quien juega contra él**:
- **Bloquea** la casilla de delante (d5): el mejor bloqueador es el caballo.
- **Cambia piezas**, sobre todo las menores: cada cambio quita fuerza al ataque y acerca un final en el que el peón será débil.
- Presiónalo con torres y piezas, y no permitas la ruptura d4-d5.`,
    pista: 'Monta una posición con un peón blanco aislado en d4 y un caballo negro bloqueando en d5.',
  },
  {
    id: 'est-doblado', bloque: 'Estructuras de peones', tema: 'Debilidades de peones',
    titulo: 'Peón doblado', en: 'Doubled pawns', lichess: '', alias: ['peones doblados', 'doblados'],
    def: 'Dos peones propios en la misma columna, normalmente tras una captura.',
    principio: 'Dos peones en la misma columna se estorban: ni se defienden ni avanzan juntos.',
    explicacion: `Aparecen cuando un peón captura y se coloca delante o detrás de otro peón propio.
- **No pueden defenderse entre sí**, y el de delante bloquea al de detrás.
- Pierden capacidad de crear un peón pasado: en una mayoría con peones doblados, a veces no se consigue coronar.
- Suelen ser más débiles si además están aislados.
**Compensaciones habituales**: una columna semiabierta al lado, más control de casillas centrales o la pareja de alfiles. Por eso, a veces se aceptan a propósito.`,
    pista: 'Monta un cambio de alfil por caballo que deje al rival con peones doblados en la columna c o f.',
  },
  {
    id: 'est-retrasado', bloque: 'Estructuras de peones', tema: 'Debilidades de peones',
    titulo: 'Peón retrasado', en: 'Backward pawn', lichess: '', alias: ['retrasado', 'peones retrasados'],
    def: 'Peón que se ha quedado atrás respecto a sus vecinos y no puede avanzar sin perderse.',
    principio: 'El peón retrasado deja delante una casilla débil: ocúpala.',
    explicacion: `Es un peón que se ha quedado por detrás de los peones de las columnas vecinas: ellos ya no pueden protegerlo, y no puede avanzar porque la casilla de delante está controlada por un peón rival.
- **La casilla de delante** se convierte en un puesto fijo para una pieza rival.
- Si está en una **columna semiabierta**, las torres rivales lo atacan de frente.
- Ejemplo típico: el peón de d6 de muchas Sicilianas, con la casilla d5 delante.
**Para quien lo tiene**: la clave es conseguir avanzarlo (la ruptura) o controlar con piezas la casilla de delante.`,
    pista: 'Monta una estructura con un peón negro retrasado en d6 y un caballo blanco instalado en d5.',
  },
  {
    id: 'est-colgantes', bloque: 'Estructuras de peones', tema: 'Debilidades de peones',
    titulo: 'Peones colgantes', en: 'Hanging pawns', lichess: '', alias: ['colgantes'],
    def: 'Dos peones unidos en el centro (normalmente c y d) sin peones propios a los lados.',
    principio: 'Unidos y móviles son fuertes; obligados a avanzar, se vuelven débiles.',
    explicacion: `Dos peones, uno al lado del otro (típicamente c4 y d4, o c5 y d5), sin peones propios en las columnas b y e.
- **Fuerza**: controlan el centro y pueden avanzar para abrir el juego en el momento oportuno.
- **Debilidad**: no se protegen el uno al otro en diagonal. Si uno avanza, el otro puede quedar retrasado o aislado.
**Contra ellos**: atácalos con piezas y con rupturas laterales (b4-b5 o e3-e4) para obligar a que uno avance o a que tengan que defenderse con piezas.
**Con ellos**: mantenlos unidos, apóyalos con piezas activas y elige bien el momento de avanzar.`,
    pista: 'Monta una posición con peones negros en c5 y d5, sin peones en b y e, y piezas blancas presionándolos.',
  },

  // ------------------------------------------------ Cadenas de peones
  {
    id: 'est-cadena', bloque: 'Estructuras de peones', tema: 'Cadenas de peones',
    titulo: 'Cadena de peones', en: 'Pawn chain', lichess: '', alias: ['cadenas de peones', 'base de la cadena', 'base débil'],
    def: 'Peones en diagonal que se protegen unos a otros. Se ataca por su base.',
    principio: 'Ataca la cadena por su base: el peón de atrás no tiene quien lo defienda.',
    explicacion: `Peones colocados en diagonal, cada uno protegiendo al de delante (por ejemplo, d4-e5 frente a d5-e6 en la Francesa).
- **La base** es el último peón de la cadena: ningún peón la defiende, y es el punto débil.
- **La cabeza** es el peón más avanzado; atacarla también es posible, pero suele ser menos eficaz.
- **Hacia dónde apunta**: normalmente cada bando juega en el flanco hacia el que apunta su cadena. En la Francesa, las blancas atacan en el flanco de rey y las negras atacan la base d4 con …c5.
**Plan típico**: rupturas de peón contra la base, apoyadas por piezas.`,
    pista: 'Monta la cadena de la Francesa (d4-e5 contra d5-e6) y prepara la ruptura negra …c5 contra la base.',
  },

  // ------------------------------------------------ Peón pasado y mayorías
  {
    id: 'est-pasado', bloque: 'Estructuras de peones', tema: 'Peón pasado y mayorías',
    titulo: 'Peón pasado', en: 'Passed pawn', lichess: 'advancedPawn', alias: ['peones pasados', 'pasado'],
    def: 'Peón sin peones rivales delante ni en las columnas vecinas: nada lo frena salvo las piezas.',
    principio: 'Los peones pasados se empujan; los del rival se bloquean.',
    explicacion: `Un peón está pasado cuando ningún peón rival puede frenarlo ni capturarlo en su camino a la coronación.
- **Hay que avanzarlo**: cuanto más avanzado, más piezas rivales tiene que atar.
- **Para frenarlo, bloquéalo**: pon una pieza justo delante. El caballo es un bloqueador excelente, y en los finales, el rey.
- **Regla de Tarrasch**: las torres van detrás de los peones pasados, tanto de los propios como de los rivales.
**Valor**: en los finales, un peón pasado suele decidir la partida.`,
    pista: 'Monta un final de torres con un peón pasado y coloca cada torre según la regla de Tarrasch.',
  },
  {
    id: 'est-pasado-protegido', bloque: 'Estructuras de peones', tema: 'Peón pasado y mayorías',
    titulo: 'Peón pasado protegido', en: 'Protected passed pawn', lichess: 'pawnEndgame', alias: ['pasado protegido'],
    def: 'Peón pasado defendido por otro peón: el rey rival no puede capturarlo.',
    principio: 'Un pasado protegido trabaja solo y deja libre a tu rey.',
    explicacion: `Es un peón pasado defendido por otro peón propio.
- El rey rival **no puede capturarlo**, así que queda atado a vigilarlo.
- Tu rey, en cambio, queda **libre** para atacar en el otro flanco.
- En los finales de peones suele ser decisivo.`,
    pista: 'Monta un final de peones con un pasado protegido en un flanco y tu rey libre para atacar en el otro.',
  },
  {
    id: 'est-pasados-unidos', bloque: 'Estructuras de peones', tema: 'Peón pasado y mayorías',
    titulo: 'Peones pasados unidos', en: 'Connected passed pawns', lichess: 'advancedPawn', alias: ['pasados unidos'],
    def: 'Dos peones pasados en columnas vecinas: se protegen y avanzan juntos.',
    principio: 'Dos pasados unidos avanzan como una apisonadora.',
    explicacion: `Dos peones pasados en columnas contiguas.
- Se protegen el uno al otro mientras avanzan: si capturan a uno, el otro sigue adelante.
- Son tan fuertes que, cuando llegan juntos a la sexta fila, a menudo vencen a una torre sin ayuda de su rey.
- Para frenarlos hay que bloquear el que va delante y atacar al de atrás.`,
    pista: 'Monta dos peones blancos pasados unidos en sexta contra una torre negra, con el rey negro lejos.',
  },
  {
    id: 'est-mayoria', bloque: 'Estructuras de peones', tema: 'Peón pasado y mayorías',
    titulo: 'Mayoría de peones', en: 'Pawn majority', lichess: '', alias: ['mayoría en el flanco de dama', 'mayoría'],
    def: 'Más peones que el rival en un flanco: con ellos se puede crear un peón pasado.',
    principio: 'Una mayoría sana es un peón pasado en potencia: el candidato va primero.',
    explicacion: `Tienes mayoría en un flanco cuando allí tienes más peones que el rival (por ejemplo, tres contra dos).
- Bien avanzada, **crea un peón pasado**.
- **El candidato va primero**: avanza antes el peón que no tiene un peón rival delante, apoyado por los demás.
- La **mayoría en el flanco de dama** se valora mucho en los finales: el pasado que crea queda lejos de los reyes.
- Si la mayoría tiene peones doblados, quizá no logre crear un pasado.`,
    pista: 'Monta una mayoría blanca de tres contra dos en el flanco de dama y crea el peón pasado avanzando primero el candidato.',
  },
  {
    id: 'est-pasado-alejado', bloque: 'Estructuras de peones', tema: 'Peón pasado y mayorías',
    titulo: 'Peón pasado alejado', en: 'Outside passed pawn', lichess: 'pawnEndgame', alias: ['pasado alejado'],
    def: 'Peón pasado lejos del resto de peones: desvía al rey rival y gana el final.',
    principio: 'El pasado alejado es un señuelo: el rey rival va a por él y tu rey se come el resto.',
    explicacion: `Es un peón pasado situado lejos de la masa principal de peones, normalmente en una columna del borde.
- En los finales de peones, el rey rival tiene que ir a frenarlo.
- Mientras tanto, **tu rey se va al otro flanco** y captura los peones que quedan.
- Por eso se considera una ventaja decisiva en los finales de peones.`,
    pista: 'Monta un final de peones con un peón pasado tuyo en la columna a y el resto de peones en el flanco de rey.',
  },

  // ------------------------------------------------ Rupturas
  {
    id: 'est-ruptura', bloque: 'Estructuras de peones', tema: 'Rupturas',
    titulo: 'Ruptura de peones', en: 'Pawn break', lichess: '', alias: ['ruptura', 'rupturas'],
    def: 'Avance de peón que ataca la estructura rival para abrir líneas o cambiar el centro.',
    principio: 'Las rupturas son los planes de los peones: prepáralas antes de jugarlas.',
    explicacion: `Una ruptura es un avance de peón que choca con los peones del rival para abrir columnas y diagonales o para cambiar la estructura.
- Casi todas las estructuras tienen **rupturas típicas**: …c5 y …f6 en la Francesa, …f5 en la India de rey, b4-b5 en la Carlsbad.
- **Hay que prepararla**: con piezas que apoyen la casilla de ruptura y que estén listas para aprovechar las líneas que se abren.
- **El momento importa**: demasiado pronto no funciona; demasiado tarde, el rival ya se ha organizado.
**Pregunta clave**: ¿cuál es mi ruptura en esta estructura? ¿Y la de mi rival?`,
    pista: 'Monta una estructura de la Francesa y prepara con piezas la ruptura …c5 antes de jugarla.',
  },
  {
    id: 'est-ruptura-coronar', bloque: 'Estructuras de peones', tema: 'Rupturas',
    titulo: 'Ruptura para coronar', en: 'Breakthrough', lichess: 'promotion', alias: ['rotura', 'sacrificio de ruptura'],
    def: 'Sacrificio de peones que abre paso a uno de ellos para coronar.',
    principio: 'A veces un peón se entrega para que otro corone.',
    explicacion: `En los finales de peones, cuando los peones de los dos bandos están frente a frente, un sacrificio puede abrir paso a uno de ellos.
- El caso clásico: tres peones blancos en a5, b5 y c5 contra tres negros en a7, b7 y c7, sin reyes cerca. **b6!** gana: si …cxb6, a6!; y si …axb6, c6!, y un peón blanco corona.
- Hay que **calcular** con precisión: si el rey rival está cerca, la ruptura puede fallar.`,
    pista: 'Monta el caso clásico: peones blancos en a5, b5 y c5 contra negros en a7, b7 y c7, con los reyes lejos, y encuentra la ruptura.',
  },

  // ------------------------------------------------ Estructuras tipo
  {
    id: 'est-carlsbad', bloque: 'Estructuras de peones', tema: 'Estructuras tipo',
    titulo: 'Estructura Carlsbad', en: 'Carlsbad structure', lichess: '', alias: ['carlsbad', 'ataque de minorías', 'ataque de las minorías'],
    def: 'Estructura del Gambito de dama, variante del cambio, con el famoso ataque de minorías.',
    principio: 'En la Carlsbad, las blancas atacan con la minoría: b4-b5 contra c6.',
    explicacion: `Aparece en el Gambito de dama, variante del cambio: blancas con peones en a2, b2, d4 y e3; negras con a7, b7, c6 y d5 (la columna c abierta para las blancas, la e para las negras).
**Plan blanco: el ataque de minorías**. Avanzar b4-b5 con dos peones contra tres para cambiar en c6 y dejar a las negras un peón débil en c6 (retrasado) o aislado.
**Otros planes blancos**: la ruptura central e3-e4 (preparada con f3) o el ataque en el flanco de rey.
**Plan negro**: juego en el flanco de rey, un caballo en e4 y, a veces, …c5 para cambiar la estructura.`,
    pista: 'Monta la estructura Carlsbad y juega el ataque de minorías b4-b5 hasta crear la debilidad en c6.',
  },
  {
    id: 'est-maroczy', bloque: 'Estructuras de peones', tema: 'Estructuras tipo',
    titulo: 'Estructura Maroczy', en: 'Maróczy bind', lichess: '', alias: ['maroczy', 'bind de maroczy'],
    def: 'Peones blancos en c4 y e4 que frenan las rupturas …b5 y …d5 de las negras.',
    principio: 'La Maroczy es una tenaza: las blancas ganan espacio, las negras esperan su ruptura.',
    explicacion: `Estructura típica de algunas Sicilianas: las blancas colocan peones en **c4 y e4**, y las negras tienen su peón en d6.
- **Para las blancas**: espacio y control de d5; las rupturas negras …b5 y …d5 son muy difíciles.
- **Para las negras**: posición sólida pero con poco espacio. Conviene **cambiar piezas** (con menos piezas, la falta de espacio molesta menos) y preparar con paciencia …b5, …d5 o …f5.
- Las negras suelen buscar la casilla d4 para un caballo y presionar c4.`,
    pista: 'Monta una Maroczy con peones blancos en c4 y e4 y prepara con las negras la ruptura …b5.',
  },
  {
    id: 'est-erizo', bloque: 'Estructuras de peones', tema: 'Estructuras tipo',
    titulo: 'Erizo', en: 'Hedgehog', lichess: '', alias: ['estructura erizo'],
    def: 'Peones negros en a6, b6, d6 y e6: posición compacta que espera su momento para romper.',
    principio: 'El erizo parece pasivo, pero tiene las púas preparadas: …b5 y …d5.',
    explicacion: `Las negras colocan sus peones en **a6, b6, d6 y e6** (normalmente contra peones blancos en c4 y e4) y las piezas detrás, en las tres primeras filas.
- Es una posición **compacta y elástica**: cede espacio, pero no tiene debilidades fáciles.
- Las negras esperan el momento de **romper** con …b5 o …d5; cuando la ruptura llega, la posición se abre y las piezas negras saltan.
- **Para las blancas**: aprovechar el espacio sin precipitarse y vigilar siempre esas dos rupturas.`,
    pista: 'Monta una estructura de erizo y prepara la ruptura …d5 con las piezas negras.',
  },
  {
    id: 'est-stonewall', bloque: 'Estructuras de peones', tema: 'Estructuras tipo',
    titulo: 'Stonewall', en: 'Stonewall', lichess: '', alias: ['muro de piedra'],
    def: 'Peones en c3, d4, e3 y f4 (o c6, d5, e6 y f5): casilla fuerte delante y un alfil malo detrás.',
    principio: 'El Stonewall regala una casilla fuerte… y deja otra débil.',
    explicacion: `Peones en **c3, d4, e3 y f4** (blancas) o **c6, d5, e6 y f5** (negras, en la Holandesa Stonewall).
- **Ventaja**: una casilla muy fuerte delante para un caballo (e5 para las blancas, e4 para las negras) y posibilidades de ataque en el flanco de rey.
- **Inconvenientes**: la casilla de detrás del peón e queda débil (e4 para las blancas, e5 para las negras), y el alfil del color de los peones queda malo, encerrado tras ellos.
- Los planes giran en torno a esas dos casillas: ocupar la fuerte y vigilar la débil.`,
    pista: 'Monta un Stonewall blanco y coloca un caballo en e5 apoyado por los peones d4 y f4.',
  },
];
