# Logic.js

Simulador de puertas lógicas

## Tecnologías

Logic.js es una aplicación de *front-end*, por lo que no hay tecnologías de servidor implicadas.

* Vanilla JS
* Konva.js (librería gráfica)
* Bootstrap 5


## Instrucciones

Hacer click en los diferentes botones para instanciar el componente correspondiente. Los elementos se pueden arrastrar. Haciendo click en la salida de un elemento (representada por un punto gris) comenzará a trazarse un cable. Puede ir haciéndose click a lo largo del trayecto para trazar un camino. Al llevar el cable sobre una entrada de otro componente (representada también por un punto gris) y hacer click sobre esta se creará el circuito entre ambos componentes, quedando conectados.

## Ejemplo

En la imagen siguiente se muestra un circuito sumador que suma dos números de A y B, de 3 bits. Estos números se representan por interruptores activados o desactivados. En este caso, el operando A es *010 (2 en decimal)* y el operando B es *011 (3 en decimal)*. El resultado de la suma de ambos es *5 (101 en binario)* como efectivamente representan los leds conectados a la salida del circuito sumador.

![](/doc/suma.png)

El siguiente es un ejemplo de un caso de desbordamiento. Al comienzo se suman los números *A = 101 (5)* y *B = 010 (2)*, dando como resultado *2 + 5 = 7 (111)* como reflejan todos los leds encendidos y siendo el número máximo que se puede representar con 3 bits.

Acto seguido se activa un bit en el operando B convirtiéndolo en *011 (3)* y quedando la suma como *5 + 3 = 8*. El 8 no puede representarse con solo 3 bits y produce un overflow, lo cual se refleja en la activación del led inferior, también conocido como *carry out*

![](/doc/overflow.gif)


## Diagrama de clases

Para simplificar, se muestra únicamente un reducido subconjunto de las clases utilizadas. Si bien existen otras clases y jerarquías, este diagrama contiene la esencia del diseño: lograr un cierto nivel de reactividad y que el programador no necesite actualizar explícitamente la salida de un componente al cambiar su entrada o conectarlo a otro componente

![](/doc/diagram.jpg)