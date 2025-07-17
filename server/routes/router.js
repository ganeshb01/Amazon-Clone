const express = require("express");
const router = new express.Router();
const Products = require("../models/productsSchema");
const USER = require("../models/userSchema")
const bcrypt = require("bcryptjs");
const athenticate = require("../middleware/authenticate");

//get productsdata api 
router.get("/getproducts", async (req, res) => {
    try {
        const productsdata = await Products.find();
        console.log("Console the data" + productsdata);
        res.status(201).json(productsdata);
    } catch (error) {
        console.log("error" + error.message);
    }
});

router.get("/getproductsone/:id", async (req, res) => {
    try {
        const { id } = req.params;
        //console.log(id);  

        const individuadata = await Products.findOne({ id: id });
        // console.log(individuadata + "individual data");
        res.status(201).json(individuadata);

    } catch (error) {
        res.status(400).json(Individuadata);
        console.log("error" + error.message);

    }
});



//register data 
router.post("/register", async (req, res) => {
    //console.log(req.body);

    const { fname, email, mobile, password, cpassword } = req.body;
    if (!fname || !email || !mobile || !password || !cpassword) {
        res.status(422).json({ error: "fill the all data" })
        console.log("not data available");
    };

    try {
        const preuser = await USER.findOne({ email: email })
        if (preuser) {
            res.status(422).json({ error: "this user is already present" })
        } else if (password != cpassword) {
            res.status(422).json({ error: "password and cpassword is not match" })
        } else {
            const finalUser = new USER({
                fname, email, mobile, password, cpassword
            });

            const storedata = await finalUser.save();
            //console.log(storedata);
            res.status(201).json(storedata);

        }
    } catch (error) {
        console.log("error the bhai catch ma for registratoin time" + error.message);
        res.status(422).send(error);

    }
});


//login user api
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: "fill the details" });
    }


    try {
        const userlogin = await USER.findOne({ email: email });
        console.log(userlogin + "user Login");

        if (userlogin) {
            const isMatch = await bcrypt.compare(password, userlogin.password);
            // console.log(isMatch);




            if (!isMatch) {
                res.status(400).json({ error: "invalid crediential pass" });
            } else {

                //token genarete
                const token = await userlogin.generatAuthtoken();
                console.log(token);
                //cookie create  
                res.cookie("Amazonweb", token, {
                    expires: new Date(Date.now() + 2589000),
                    httpOnly: true

                });

                res.status(201).json(userlogin);

            }
        } else {
            res.status(400).json({ error: "invalid crediential pass" });
        }

    } catch (error) {
        res.status(400).json({ error: "invalid details" })
        console.log("error the bhai catch ma for login time" + error.message);
    }

})


// adding the data into cart
router.post("/addcart/:id", athenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await Products.findOne({ id: id });
        console.log(cart + "cart value");

        const UserContact = await USER.findOne({ _id: req.userID });
        console.log(UserContact);

        if (UserContact) {
            const cartData = await UserContact.addcartdata(cart);
            await UserContact.save();
            console.log(cartData);
            res.status(201).json(UserContact);
        } else {
            res.status(401).json({ error: "invalid user" });
        }

    } catch (error) {
        res.status(401).json({ error: "invalid user" });
    }
})


//get cart detail 
router.get("/cartdetails", athenticate, async (req, res) => {
    try {
        const buyuser = await USER.findOne({ _id: req.userID });
        res.status(201).json(buyuser)
    } catch (error) {
        console.log("error" + error);
    }
})

//get valied user
router.get("/validuser", athenticate, async (req, res) => {
    try {
        const validuserone = await USER.findOne({ _id: req.userID });
        res.status(201).json(validuserone)
    } catch (error) {
        console.log("error" + error);
    }
})



//for user Logiut

router.get("/lougout", athenticate, (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
            return curelem.token !== req.token
        });


        res.clearCookie("Amazonweb", { path: "/" });

        req.rootUser.save();
        res.status(201).json(req.rootUser.tokens);
        console.log("uuser logout");
    } catch (error) {
        // res.status(01).json(req.rootUser.toekns);
        console.log("error for user logout");
    }
})

// remove iteam from the cart



router.get("/remove/:id", athenticate, async (req, res) => {
    try {
        const { id } = req.params;

        req.rootUser.carts = req.rootUser.carts.filter((cruval) => {
            return cruval.id != id;
        });

        req.rootUser.save();
        res.status(201).json(req.rootUser);
        console.log("item remove");
    } catch (error) {
        console.log("error hain" + error);
        res.status(400).json(req.rootUser);
    }
})

module.exports = router;
