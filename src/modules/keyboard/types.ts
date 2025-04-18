export type KeyboardControllerStatus =
  | 'disabled'     // Полностью выключен
  | 'idle'         // Ожидание действий (работает по умолчанию)
  | 'recording'    // тест
  | 'registrating' // Регистрация аккорда
  | 'playing';     // Аккорд выбран и готов к проигрыванию