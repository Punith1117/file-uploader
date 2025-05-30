const express = require('express')
const app = express()
const session = require("express-session");
const passport = require('passport');
const LocalStrategy = require('passport-local');
app.use(express.urlencoded({ extended: true }));
const { PrismaClient } = require('./generated/prisma/')
const prisma = new PrismaClient()
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const multer  = require('multer');
const { isAuthenticated } = require('./middleware');
const upload = multer({ dest: './uploads/' })


app.use(session({
    secret: "cats",
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
}));

app.use(passport.session());

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
        let user = await prisma.user.findFirst({
          where: {
            username: username
          }
        })

      if (!user) {
        return done(null, false, { message: "Incorrect username or password" });
      }
      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password or password" });
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    let user = await prisma.user.findFirst({
      where: {
        id: id
      }
    })
    done(null, user);
  } catch(err) {
    done(err);
  }
});

app.post('/create/folder', isAuthenticated, async (req, res) => {
  await prisma.folders.create({
    data: {
      name: req.body.folderName,
      userId: req.user.id
    }
  })
  res.redirect('/')
})
app.post('/delete/folder', isAuthenticated, async (req, res) => {
  const toDelete = await prisma.folders.findFirst({
    where: {
      name: req.body.folderName,
      userId: req.user.id
    }
  })
  await prisma.folders.delete({
    where: {
      id: toDelete.id,
    }
  })
  res.redirect('/')
})

app.post('/upload', isAuthenticated, upload.single('file'), async (req, res) => {
  const file = req.file
  const folderName = req.body.folderName
  const dateTime = new Date()
  const sizeInMB = Number((file.size / (1024 * 1024)).toFixed(2))
  const folder = await prisma.folders.findFirst({
    where: {
      name: folderName,
      userId: req.user.id
    }
  })
  await prisma.uploads.create({
    data: {
      name: file.originalname,
      downloadUrl: 'dummy',
      uploadDateTime: dateTime,
      sizeMb: sizeInMB,
      folderId: folder.id
    }
  })
  const result = file.originalname + ' successfully uploaded in folder ' + folderName
  res.send(result)
})
app.post('/delete/file', isAuthenticated, async (req, res) => {
  const folderName = req.body.folderName
  const fileName = req.body.fileName
  const folder = await prisma.folders.findFirst({
    where: {
      name: folderName,
      userId: req.user.id
    }
  })
  const file = await prisma.uploads.findFirst({
    where: {
      name: fileName,
      folderId: folder.id
    }
  })
  await prisma.uploads.delete({
    where: {
      id: file.id
    }
  })
  res.send(fileName + ' successfully deleted from folder ' + folderName)
})
app.get('/', (req, res) => {
  if (req.isAuthenticated())
    res.send('You are authenticated')
  else
    res.send('You are not authenticated')
})

app.post('/log-in', passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/"
}))
app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.send("logged out");
  });
});

const PORT = 3000
app.listen(PORT, (err) => {
    if (err)
        console.log(err)
    else 
        console.log('App successfully running on port', PORT)
})