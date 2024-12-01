export const CLIENT_DEFINITION = [
  `A Client is defined by the following fields:`,
  ` - name         The name of the Client.`,
  ` - email        The email address of the Client.`,
  ` - phoneNumber  The phone number of the Client.`,
  ` - city         The city where the Client is located.`,
  ` - country      The country where the Client is located.`,
  ` - ownerId      Identifier of the owner associated with the Client.`,
  ` - status       The current status of the Client, represented as a string and Defined by the following status:
        - client          Is currently a client
        - lead            Is currently a lead client
        - not interested  Is currently not interested for the moment`,
  ` - createdAt    The timestamp when the Client was created, auto-generated as the current time.`,
  ` - createdBy    Identifier of the user who created the Client.`,
  ` - createdAt    The timestamp when the Client was created.`,
  ` - createdBy    Identifier of the user who created the Client.`,
  ` - Documents    A list of associated Documents related to the Client.`,
  ` - Events       A list of associated Events related to the Client.`,
  ` - History      A list of historical actions associated with the Client.`,
  ` - Notes        A list of notes associated with the Client.`,
];

export const DOCUMENT_DEFINITION = [
  `A Document is defined by the following fields:`,
  ` - type      The type of Document, represented as a string and Defined by the following types:
        - invoice   Document is an invoice for a Client
        - quote     Document is a quote for a Client`,
  ` - clientId   Identifier of the client associated with the Document.`,
  ` - amount    The monetary value of the Document, represented as an integer.`,
  ` - products  Document's products in JSON format Defined by the following properties:
        - name      Product's name
        - quantity  Product's quantity
        - unitPrice Product's price
        - total     Total of all products`,
  ` - status    Document's status Defined by the following status:
        - paid    Document was paid
        - sent    Document was send
        - draft   Document is in draft 
        - unpaid  Document is not paid `,
  ` - createdAt  The timestamp when the Document was created, in DateTime format.`,
  ` - createdBy  Identifier of the user who created the Document.`,
];

export const EVENTS_DEFINITION = [
  `An Event is defined by the following fields:`,
  ` - clientId    Identifier of the client associated with the Event.`,
  ` - name        The name of the Event.`,
  ` - description A detailed description of the Event.`,
  ` - startingAt  The start time of the Event, in DateTime format.`,
];

export const HISTORY_DEFINITION = [
  `A History record is defined by the following fields:`,
  ` - clientId   Identifier of the client associated with the History record.`,
  ` - action     The action performed, represented as a string.`,
  ` - createdAt  The timestamp when the History record was created, in DateTime format.`,
  ` - createdBy  Identifier of the user who created the History record.`,
];

export const NOTES_DEFINITION = [
  `A Note is defined by the following fields:`,
  ` - clientId     Identifier of the client associated with the Note.`,
  ` - description  The content or description of the Note.`,
  ` - createdAt    The timestamp when the Note was created.`,
  ` - createdBy    Identifier of the user who created the Note.`,
];

export const ALL_DATA_DEFINITIONS = [
  ...CLIENT_DEFINITION,
  ...DOCUMENT_DEFINITION,
  ...EVENTS_DEFINITION,
  ...HISTORY_DEFINITION,
  ...NOTES_DEFINITION,
];
