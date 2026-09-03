const defineAbilityFor = require("./src/auth/ability");

const users = [
    {
        role: "admin"
    },
    {
        role: "recruiter"
    },
    {
        role: "interviewer"
    }
];

users.forEach(user => {
    const ability = defineAbilityFor(user);

    console.log(`\nRole: ${user.role}`);

    console.log(
        "users.read:",
        ability.can("read", "users")
    );

    console.log(
        "users.delete:",
        ability.can("delete", "users")
    );

    console.log(
        "jobs.create:",
        ability.can("create", "jobs")
    );

    console.log(
        "interviews.create:",
        ability.can("create", "interviews")
    );

    console.log(
        "feedback.create:",
        ability.can("create", "feedback")
    );

    console.log(
        "offers.create:",
        ability.can("create", "offers")
    );
});