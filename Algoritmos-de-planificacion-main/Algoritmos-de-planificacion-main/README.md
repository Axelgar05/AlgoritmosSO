# Simulador de Algoritmos de Planificación de Procesos

Este proyecto es una aplicación web interactiva que simula la gestión de procesos en un sistema operativo, implementando los principales algoritmos de planificación: FCFS, SJF, SRTF y Round Robin.

## Características
- **Interfaz gráfica amigable**: Añade, visualiza y simula procesos fácilmente.
- **Algoritmos implementados**:
	- FCFS (First Come First Served)
	- SJF (Shortest Job First)
	- SRTF (Shortest Remaining Time First)
	- RR (Round Robin, configurable con quantum)
- **Simulación visual paso a paso**: Cada unidad de tiempo equivale a 5 segundos reales.
- **Visualización de la cola y el historial de procesos**.
- **Gráfica de ejecución tipo Gantt**.

## ¿Cómo usarlo?
1. **Clona o descarga este repositorio.**
2. **Abre la carpeta en VS Code** (o tu editor favorito).
3. **Ejecuta un servidor local** (requerido por los módulos JS):
	 - Recomendado: Instala la extensión "Live Server" en VS Code y abre `index.html` con Live Server.
	 - Alternativa: Usa Python en terminal:
		 - `python -m http.server 8000`
		 - Luego abre `http://localhost:8000/Algoritmos-de-planificacion-main/index.html` en tu navegador.
4. **Agrega procesos** usando el formulario.
5. **Selecciona un algoritmo** y observa la simulación animada.

## Estructura del proyecto
```
Algoritmos-de-planificacion-main/
├── index.html
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── FCFS.js
│       ├── SJF.js
│       ├── SRTF.js
│       ├── RR.js
│       ├── chart.min.js
│       └── index.js
├── README.md
└── LICENSE
```

## Capturas de pantalla
_Agrega aquí tus propias capturas de la interfaz y simulación en funcionamiento._

## Créditos
- Desarrollado por [Tu Nombre o Equipo].
- Proyecto académico para la materia de Sistemas Operativos.

## Licencia
Este proyecto está bajo la licencia MIT.