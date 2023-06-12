export type Person = {
    name: string;
    setting: string;
};

export type Persons = {
    personA: Person;
    personB: Person;
};

export type Message = [
    {
        user: string;
        text: string;
    }
];

export type APIRequest = {
    messages: Message;
    persons: Persons;
    apiKey: string
};
