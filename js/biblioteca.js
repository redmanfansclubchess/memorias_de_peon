// =====================================================================
//  MdP · biblioteca.js — fichas de serie («Sugerida por MdP»)
//  Solo teoría: el ejemplo en el tablero lo crea el alumno.
//  Cada ficha aparece cuando su tema está activo, translúcida hasta
//  que se le añade un ejemplo propio. Textos propios de MdP.
//  Tanda 1 · Táctica (18 fichas)
// =====================================================================
export const BIBLIOTECA_VERSION = '1';

export const BIBLIOTECA = [
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
];
