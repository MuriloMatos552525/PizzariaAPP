
# PizzariaManager

PizzariaManager é um aplicativo gerencial para uma pizzaria, desenvolvido com React Native e Expo. O aplicativo permite registrar funcionários, gerenciar vales e atualizar informações salariais.

## Funcionalidades

- Registro de funcionários
- Atualização de informações salariais
- Registro de vales
- Limpeza de vales
- Autenticação de usuários

## Pré-requisitos

Certifique-se de ter o Node.js e o npm instalados em sua máquina. Você também precisará do Expo CLI e do EAS CLI.

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/PizzariaManager.git
   cd PizzariaManager
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```


## Desenvolvimento

Para iniciar o servidor de desenvolvimento, execute:
```bash
npx expo start
```

## Estrutura do Projeto

```plaintext
PizzariaManager/
├── assets/                 # Assets como ícones e imagens
├── src/                    # Código fonte do aplicativo
│   ├── screens/            # Telas do aplicativo
│   │   ├── HomeScreen.tsx
│   │   ├── ValeRegistrationScreen.tsx
│   │   ├── EmployeeRegistrationScreen.tsx
│   │   ├── EmployeeDetailsScreen.tsx
│   │   ├── ConfirmarLimpezaScreen.tsx
│   │   └── DeleteEmployeeScreen.tsx
│   ├── services/           # Serviços e configurações
│   │   └── firebaseConfig.ts
│   └── App.tsx             # Componente raiz do aplicativo
├── app.json                # Configurações do Expo
├── eas.json                # Configurações do EAS
└── package.json            # Dependências e scripts do npm
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/fooBar`)
3. Commit suas alterações (`git commit -am 'Add some fooBar'`)
4. Envie para a branch (`git push origin feature/fooBar`)
5. Crie um novo Pull Request

## Licença

Este projeto está licenciado sob a MIT License.

## Contato

Murilo Matos - [murilocarlosm@hotmail.com](mailto:murilocarlosm@hotmail.com)

Link do Projeto: [https://github.com/MuriloMatos552525/PizzariaManager](https://github.com/MuriloMatos552525/PizzariaManager)
```

Este README.md fornece uma visão geral completa do projeto, incluindo instruções de instalação, desenvolvimento, construção e contribuição. Certifique-se de atualizar os links e as informações de contato conforme necessário para refletir seu projeto específico.
