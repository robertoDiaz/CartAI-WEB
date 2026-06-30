# Reglas del Proyecto

- **NO realizar commits ni subidas (push) automáticamente.**
  Bajo ninguna circunstancia los agentes autónomos de Antigravity deben ejecutar comandos de control de versiones (`git commit`, `git push`, etc.) de manera proactiva o automática tras realizar cambios.
  Cualquier operación de control de versiones debe ser autorizada o solicitada explícitamente por el usuario.

- **Orden alfabético para las claves de traducción.**
  Todas las claves de traducción de los archivos de localización (como `es_ES.json` y `en_US.json`) dentro de un mismo bloque deben estar estrictamente ordenadas en orden alfabético.

- **Uso de custom hooks para encapsular lógica y efectos (`useEffect`).**
  Los archivos de vista de páginas principales (`*Page.tsx`) deben contener prácticamente solo marcado JSX. Toda la lógica de obtención de datos, estados secundarios y efectos secundarios (`useEffect`) debe ser extraída y encapsulada en custom hooks dedicados (generalmente en una carpeta `hooks/` dentro de la respectiva característica).

- **Uso de claves de traducción.**
  no se puede hardcodear en las clases mensajes que aparezcan por pantalla que no estén internacionalizados.

- **Creación y Modificación de Tests.**
  Si un cambio introduce nueva funcionalidad o modifica la existente, es obligatorio crear o adaptar los tests correspondientes (unitarios, de integración o funcionales/E2E) para dar cobertura a los cambios realizados.

