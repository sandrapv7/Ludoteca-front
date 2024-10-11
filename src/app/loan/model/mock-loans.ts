import { Loan } from "./Loan";

export const LOAN_DATA: Loan[] = [
        { id: 1, dateStart: new Date('2003-03-12'), dateEnd: new Date('2003-03-13'),
        client: { id: 1, name: 'Sandra' },
        game: { id: 1, title: 'Juego 1', age: 6, category: { id: 1, name: 'Categoría 1' }, author: { id: 1, name: 'Autor 1', nationality: 'Nacionalidad 1' } },}
]
