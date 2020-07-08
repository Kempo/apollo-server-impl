export const people = [
    {
        id: '1',
        name: 'Bill Gates',
        network: [{id: '1'}, {id: '4'}]
    },
    {
        id: '2',
        name: 'Tom Hanks',
        network: [{id: '3'}]
    },
    {
        id: '3',
        name: 'Will Brazil',
        network: [{id: '4'}]
    },
    {
        id: '4',
        name: 'Josh Luber',
        network: [{id: '1'}, {id: '2'}, {id: '3'}]
    }
];

export const networks = [
    {
        id: '',
        network: []
    },
    {
        id: '',
        network: []
    },
    {

    }
]

/*
export const people = [
    {
        id: '1',
        name: 'Bill Gates',
        network: [{id: '1'}, {id: '4'}]
    },
    {
        id: '2',
        name: 'Tom Hanks',
        network: [{id: '3'}]
    },
    {
        id: '3',
        name: 'Will Brazil',
        network: [{id: '4'}]
    },
    {
        id: '4',
        name: 'Josh Luber',
        network: [{id: '1'}, {id: '2'}, {id: '3'}]
    }
];
*/

/**
 * 
 * network: {
 *  people: []
 * 
 * }
 */

export const purchases = [
    {
        id: "21d4a84d48ebea6d5d59",
        shipped: false,
        date: "today",
        item: { sku: "SMITHS" }, // look into this detail
        buyer: { id: "3" }
    }
]

export const items = [
    {
        sku: "JORDAN",
        name: "Air Jordan 1s",
        brand: "Nike"
    },
    {
        sku: "SMITHS",
        name: "Stan Smiths",
        brand: "Adidas"
    }
]