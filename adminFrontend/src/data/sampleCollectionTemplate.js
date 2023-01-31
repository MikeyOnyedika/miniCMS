export const template = {
    collectionName: 'animal',
    fields: {
        count: {
            label: 'Count',
            formInputType: 'number',
            required: true,
            exampleValue: '3',
            options: null,
            unique: false
        },
        species: {
            label: 'Species',
            formInputType: 'text',
            required: false,
            exampleValue: 'arachnid',
            unique: false,
            options: null
        },
        'animal-password': {
            label: 'Animal Password',
            formInputType: 'password',
            required: false,
            exampleValue: 'ankie901dk',
            unique: false,
            options: null
        },
        'eating-habit': {
            label: 'Eating Habit',
            formInputType: 'select',
            required: false,
            exampleValue: 'select an option',
            unique: false,
            options: [
                {
                    id: 0,
                    value: '',
                    text: 'Select a eating habit',
                },
                {
                    id: 1,
                    value: 'carnivore',
                    text: 'Carnivore',
                },
                {
                    id: 2,
                    value: 'herbivore',
                    text: 'Herbivore',
                },
                {
                    id: 3,
                    value: 'omnivore',
                    text: 'Omnivore',
                },
            ],
        },
        description: {
            label: 'Description',
            formInputType: 'textarea',
            exampleValue: 'Some animal description',
            required: false,
            unique: false,
            options: null
        },
        'registration-time': {
            label: 'Registration Time',
            formInputType: 'time',
            exampleValue: '21:00',
            required: false,
            unique: false,
            options: null
        },
        'is-alive': {
            label: 'Is Alive',
            formInputType: 'checkbox',
            exampleValue: '',
            required: true,
            unique: false,
            options: null
        },
        gender: {
            label: 'Gender',
            formInputType: 'radio',
            exampleValue: '',
            required: false,
            unique: false,
            options: [
                {
                    id: 0,
                    checked: true,
                    value: 'male',
                    text: 'Male',
                },
                {
                    id: 1,
                    checked: false,
                    value: 'female',
                    text: 'Female',
                },
            ],
        },
        'create-new': {
            label: '+ Create',
            formInputType: 'submit',
            exampleValue: '',
            required: false,
            unique: false,
            options: null
        },
    },
    config: {
        includeTimeStamps: true,
    },
};
