/**
 * @COMMON_CONST
 */

const status = {
    ACTIVE: 1,
    IN_ACTIVE: 2,
    DELETE: 3
};

const errorMsg = {
    SWW: 'something went wrong!'
}

const select = {

    MENU_AG: [
        'menuName',
        'menukey',
        'menuType',
        'isNew',
        'menuReferenceId'
    ],

    ACCESS_AG: [
        'accessName',
        'accessDescription'
    ]

}

exports.select = select;
exports.status = status;
exports.errorMsg = errorMsg;