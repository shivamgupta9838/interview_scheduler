const { AbilityBuilder, createMongoAbility } = require("@casl/ability");
const permissions = require("./permissions");

function defineAbilityFor(user) {
    const { can, build } = new AbilityBuilder(createMongoAbility);

    const userPermissions = permissions[user.role] || [];

    userPermissions.forEach(permission => {
        const [resource, action] = permission.split(".");

        can(action, resource);
    });

    return build();
}

module.exports = defineAbilityFor;