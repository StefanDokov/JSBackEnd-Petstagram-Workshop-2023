const router = require('express').Router();
const { isAuthorized } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorUtils');
const photoManager = require('../managers/photoManager');

router.get('/catalog', async(req, res) => {
    const photoes = await photoManager.getAll().populate('owner');

    res.render('catalog', { photoes });
});

router.get('/addphoto', isAuthorized, (req, res) => {
    res.render('create');
});

router.post('/addphoto', async (req, res) => {
    const photoData = req.body;
    try {
        await photoManager.create(req.user._id, photoData);
    } catch (err) {
        return res.status(400).render('create', { err: getErrorMessage(err) });
    }
    res.redirect('/catalog');

});

router.get('/details/:photoId', async(req, res) => {
    const photo = await photoManager.getOne(req.params.photoId).populate('commentList.userID').populate('owner').lean();
    let checker = true;
    const isOwner = photo.owner?._id == req.user?._id;
    if (isOwner) {
        checker = false;
    }

   res.render('details', {photo, isOwner, checker});

});

router.post('/details/:photoId', async(req, res) => {
    const {comment} = req.body;
    const photo = await photoManager.getOne(req.params.photoId).lean();
    photo.commentList.push({userID: req.user._id, comment});
    await photoManager.updateComments(req.params.photoId, photo);
    res.redirect('/catalog');
});

router.get('/delete/:photoId', isAuthorized,async(req, res) => {
    const phototo = await photoManager.getOne(req.params.photoId).lean();
    
    const isOwner = phototo.owner?._id == req.user?._id;

    if (!isOwner) {
        let mess = "Not an owner!"
        return res.redirect('404', {err: getErrorMessage(mess)});
    }

  await photoManager.delete(req.params.photoId);

  res.redirect('/catalog');
});

router.get('/edit/:photoId', isAuthorized,async(req, res) => {

    const phototo = await photoManager.getOne(req.params.photoId).lean();

    const isOwner = phototo.owner?._id == req.user?._id;

    if (!isOwner) {
        let mess = "Not an owner!"
        return res.redirect('404', {err: getErrorMessage(mess)});
    }
    res.render('edit', { phototo });
});

router.post('/edit/:photoId', async(req, res) => {
     const photoData = req.body;
 try {
    await photoManager.update(req.params.photoId, photoData);
 } catch(err) {
    return res.status(400).render('404', {err: getErrorMessage(err)});
 }
 res.redirect('/catalog');

});

router.get('/profile', async (req, res) => {
   const profiler = await photoManager.getUser(req.user._id);
   const pictures = await photoManager.search(req.user._id);
   
   res.render('profile', {profiler, pictures});
});

router.get('/profile/:userId', async (req, res) => {
    const profiler = await photoManager.getUser(req.params.userId);
    const pictures = await photoManager.search(req.params.userId);
    
    res.render('profile', {profiler, pictures});
 });





module.exports = router;