# FlashCards – bakalařský projekt FEL ČVUT
Webová aplikace pro efektivní učení pomocí flash karet a intervalového opakování.
* Dostupné na: [https://frontend-278072296500.europe-central2.run.app/](https://frontend-647416143124.europe-central2.run.app/)


## Hlavní funkce
| Oblast           | Přehled                                                          |
| ---------------- | ---------------------------------------------------------------- |
| **Účty**         | registrace, přihlášení, JWT autentizace, správa profilu          |
| **Správa karet** | tvorba sad, editace, štítky, obrázky (max. 1 pro otázku/odpověď) |
| **Režim učení**  | aktivní vybavování, Leitnerův systém, vyhodnocení úspěšnosti     |
| **Sdílení**      | veřejné sady, přidání do vlastní kolekce                         |
| **Statistiky**   | procento zvládnutých karet, historie opakování                   |
| **UX**           | responzivní rozhraní, světlé/temné barevné schéma                |

## Technologie
| Vrstva   | Stack                                                                              |
| -------- | ---------------------------------------------------------------------------------- |
| Backend  | **Spring Boot 3**, Spring Security, Hibernate (JPA), Feign Client        |
| Databáze | **PostgreSQL 15**                                                    |
| Frontend | **React 18** + TypeScript, **Vite**, Material Design Bootstrap (MDB) |
