// Site chrome copy. Menu content comes from the database; this covers
// everything the interface says on its own.
export const LANGUAGES = ["en", "mn"];

export const DICTIONARY = {
  "nav.home": { en: "Home", mn: "Нүүр" },
  "nav.menu": { en: "Menu", mn: "Цэс" },
  "nav.story": { en: "Our craft", mn: "Бидний тухай" },
  "nav.visit": { en: "Visit", mn: "Байршил" },
  "nav.orders": { en: "My orders", mn: "Миний захиалга" },

  "brand.tagline": {
    en: "Hand made sourdough pizza",
    mn: "Гар аргаар хийсэн исгэсэн зуурмагтай пицца",
  },

  "action.login": { en: "Log in", mn: "Нэвтрэх" },
  "action.signup": { en: "Sign up", mn: "Бүртгүүлэх" },
  "action.logout": { en: "Log out", mn: "Гарах" },
  "action.sendResetLink": { en: "Send reset link", mn: "Холбоос илгээх" },
  "action.resetPassword": { en: "Update password", mn: "Нууц үг шинэчлэх" },
  "action.call": { en: "Call", mn: "Залгах" },
  "action.seeMenu": { en: "See the menu", mn: "Цэс үзэх" },
  "action.add": { en: "Add to order", mn: "Захиалгад нэмэх" },
  "action.checkout": { en: "Go to checkout", mn: "Захиалга баталгаажуулах" },
  "action.placeOrder": { en: "Place order", mn: "Захиалга өгөх" },
  "action.close": { en: "Close", mn: "Хаах" },
  "action.back": { en: "Back to the menu", mn: "Цэс рүү буцах" },

  "hero.eyebrow": { en: "Wood-fired · Ulaanbaatar", mn: "Түлээний галд · Улаанбаатар" },
  "hero.titleA": { en: "Wood-fired", mn: "Түлээний галд" },
  "hero.titleB": { en: "sourdough pizza.", mn: "исгэсэн зуурмагтай пицца." },
  "hero.sub": {
    en: "A dough that takes two days and an oven that takes ninety seconds. Handmade, honest ingredients, nine pizzas.",
    mn: "Хоёр хоног исэх зуурмаг, ерэн секундэд шарах зуух. Гараар хийсэн, шударга орц, есөн пицца.",
  },
  "hero.subShort": {
    en: "A dough that takes two days and an oven that takes ninety seconds.",
    mn: "Хоёр хоног исэх зуурмаг, ерэн секундэд шарах зуух.",
  },
  "hero.ovenAlt": {
    en: "The wood-fired oven with a fire burning inside it",
    mn: "Дотроо гал асаж буй түлээний зуух",
  },

  "facts.hours": { en: "Open", mn: "Цагийн хуваарь" },
  "facts.hoursValue": { en: "Mon–Sat · 11:00–23:00", mn: "Даваа–Бямба · 11:00–23:00" },
  "facts.find": { en: "Find us", mn: "Хаяг" },
  "facts.findValue": { en: "Behind the Square", mn: "Талбайн чанх ард" },
  "facts.delivery": { en: "Delivery", mn: "Хүргэлт" },
  "facts.deliveryValue": { en: "Toki", mn: "Toki" },
  "facts.oven": { en: "Oven", mn: "Зуух" },
  "facts.ovenValue": { en: "Wood-fired", mn: "Түлээний гал" },

  "menu.title": { en: "The menu", mn: "Цэс" },
  "menu.eyebrow": { en: "Food & drink", mn: "Хоол, ундаа" },
  "menu.lede": {
    en: "Everything is made to order. Prices in tögrög; the kitchen closes with the room at 23:00.",
    mn: "Бүх хоолыг захиалгаар бэлддэг. Үнэ төгрөгөөр. Гал тогоо 23:00 цагт хаагдана.",
  },
  "menu.food": { en: "Food", mn: "Хоол" },
  "menu.drinks": { en: "Drinks", mn: "Ундаа" },
  "menu.all": { en: "Everything", mn: "Бүгд" },
  "menu.empty": {
    en: "The menu is not loading right now. Call 7777-1088 and we will read it to you.",
    mn: "Цэс одоогоор ачаалагдахгүй байна. 7777-1088 руу залгаарай.",
  },
  "menu.soldOut": { en: "Not available today", mn: "Өнөөдөр байхгүй" },

  "legend.spicy": { en: "Spicy", mn: "Халуун ногоотой" },
  "legend.vegetarian": { en: "Vegetarian", mn: "Цагаан хоол" },
  "legend.white": { en: "White — no tomato", mn: "Цагаан пицца — лоольгүй" },

  "cart.title": { en: "Your order", mn: "Таны захиалга" },
  "cart.empty": { en: "Nothing in the order yet.", mn: "Захиалга хоосон байна." },
  "cart.total": { en: "Total", mn: "Нийт" },
  "cart.remove": { en: "Remove", mn: "Хасах" },

  "cart.orderDetail": { en: "Order detail", mn: "Захиалгын дэлгэрэнгүй" },
  "cart.tabCart": { en: "Cart", mn: "Сагс" },
  "cart.tabOrder": { en: "Order", mn: "Захиалга" },
  "cart.clear": { en: "Empty the cart", mn: "Сагсыг хоослох" },
  "cart.clearTitle": { en: "Empty the cart?", mn: "Сагсыг хоослох уу?" },
  "cart.clearBody": {
    en: "Everything in the cart is removed. The menu stays as it is.",
    mn: "Сагсанд байгаа бүх зүйл хасагдана. Цэс хэвээрээ үлдэнэ.",
  },
  "orders.signIn": {
    en: "Log in to see the orders you have placed.",
    mn: "Захиалгаа харахын тулд нэвтэрнэ үү.",
  },
  "orders.loading": { en: "Loading…", mn: "Ачаалж байна…" },
  "checkout.title": { en: "Checkout", mn: "Захиалга" },
  "checkout.delivery": { en: "Delivery", mn: "Хүргэлт" },
  "checkout.pickup": { en: "Pickup", mn: "Очиж авах" },
  "checkout.name": { en: "Name", mn: "Нэр" },
  "checkout.phone": { en: "Phone", mn: "Утас" },
  "checkout.address": { en: "Delivery address", mn: "Хүргэлтийн хаяг" },
  "checkout.note": { en: "Note for the kitchen", mn: "Гал тогоонд үлдээх тэмдэглэл" },
  "checkout.phone2": { en: "Additional phone", mn: "Нэмэлт утасны дугаар" },
  "checkout.addressTitle": { en: "Delivery details", mn: "Хүргэлтийн мэдээлэл" },
  "checkout.addressType": { en: "Address type", mn: "Хаягийн төрөл" },
  "checkout.home": { en: "Home", mn: "Орон сууц" },
  "checkout.office": { en: "Office", mn: "Оффис" },
  "checkout.entrance": { en: "Entrance", mn: "Орц" },
  "checkout.floor": { en: "Floor", mn: "Давхар" },
  "checkout.apartment": { en: "Apartment", mn: "Тоот" },
  "checkout.addressNote": { en: "Extra address detail", mn: "Хаягийн нэмэлт тайлбар" },
  "checkout.addressNotePlaceholder": {
    en: "Door code, landmark…",
    mn: "Орцны код … гэх мэт",
  },
  "checkout.numberPlaceholder": { en: "No…", mn: "№…" },
  "checkout.changeAddress": { en: "Change", mn: "Солих" },
  "checkout.summary": { en: "Order summary", mn: "Захиалгын тойм" },
  "checkout.placed": { en: "Order placed", mn: "Захиалга хүлээн авлаа" },
  "checkout.placedBody": {
    en: "We will call to confirm. Delivery runs through Toki.",
    mn: "Бид баталгаажуулахаар залгана. Хүргэлт Toki-гоор явна.",
  },

  "orders.title": { en: "Your orders", mn: "Таны захиалга" },
  "orders.empty": { en: "No orders yet.", mn: "Захиалга алга." },

  "status.pending": { en: "Received", mn: "Хүлээн авсан" },
  "status.preparing": { en: "In the oven", mn: "Зууханд" },
  "status.ready": { en: "Ready", mn: "Бэлэн" },
  "status.on-the-way": { en: "On the way", mn: "Замдаа" },
  "status.delivered": { en: "Delivered", mn: "Хүргэгдсэн" },
  "status.cancelled": { en: "Cancelled", mn: "Цуцалсан" },

  "auth.loginTitle": { en: "Log in", mn: "Нэвтрэх" },
  "auth.signupTitle": { en: "Create an account", mn: "Бүртгэл үүсгэх" },
  "auth.email": { en: "Email", mn: "И-мэйл" },
  "auth.password": { en: "Password", mn: "Нууц үг" },
  "auth.confirm": { en: "Confirm password", mn: "Нууц үг давтах" },
  "auth.haveAccount": { en: "Already have an account?", mn: "Бүртгэлтэй юу?" },
  "auth.noAccount": { en: "No account yet?", mn: "Бүртгэл байхгүй юу?" },
  "auth.forgotPassword": { en: "Forgot password?", mn: "Нууц үгээ мартсан уу?" },
  "auth.forgotPasswordTitle": { en: "Reset your password", mn: "Нууц үг сэргээх" },
  "auth.forgotPasswordLede": {
    en: "Enter your email and we'll send you a reset link.",
    mn: "И-мэйл хаягаа оруулбал сэргээх холбоос илгээнэ.",
  },
  "auth.resetEmailSent": {
    en: "If that email is registered, a reset link is on its way.",
    mn: "Хэрэв энэ и-мэйл бүртгэлтэй бол сэргээх холбоос очиж байна.",
  },
  "auth.resetPasswordTitle": { en: "Choose a new password", mn: "Шинэ нууц үг сонгох" },
  "auth.newPassword": { en: "New password", mn: "Шинэ нууц үг" },
  "auth.backToLogin": { en: "Back to log in", mn: "Нэвтрэх хуудас руу буцах" },
  "auth.resetSuccess": {
    en: "Password updated. You can log in now.",
    mn: "Нууц үг шинэчлэгдлээ. Одоо нэвтэрч болно.",
  },
  "auth.invalidResetLink": {
    en: "This reset link is invalid or missing. Request a new one.",
    mn: "Энэ холбоос хүчингүй байна. Дахин хүсэлт илгээнэ үү.",
  },

  "visit.title": {
    en: "Behind the Square, 20 metres west of Flora.",
    mn: "Талбайн чанх ард, Флорагаас баруун тийш 20 метр.",
  },
  "visit.address": { en: "Address", mn: "Хаяг" },
  "visit.addressValue": {
    en: "Directly behind the Square, 20 m west of the Flora flower shop",
    mn: "Талбайн чанх ард, Флора цэцгийн дэлгүүрээс баруун тийш 20 метр",
  },
  "visit.phone": { en: "Phone", mn: "Утас" },
  "visit.hours": { en: "Hours", mn: "Цагийн хуваарь" },
  "visit.weekdays": { en: "Monday – Saturday", mn: "Даваа – Бямба" },
  "visit.sunday": { en: "Sunday", mn: "Ням" },
  "visit.closed": { en: "Closed", mn: "Амарна" },
  "visit.service": { en: "Service", mn: "Үйлчилгээ" },
  "visit.serviceValue": {
    en: "Dine-in · Takeaway · Delivery with Toki",
    mn: "Ресторандаа · Авч явах · Toki хүргэлт",
  },

  "story.eyebrow": { en: "Our craft", mn: "Бидний ажил" },
  "story.title": {
    en: "One oven, one dough, no shortcuts.",
    mn: "Нэг зуух, нэг зуурмаг, товчлол үгүй.",
  },
  "story.p1": {
    en: "Poca is a small pizzeria behind the Square, built around a wood-fired oven and a sourdough starter.",
    mn: "Poca бол талбайн ард байрлах жижиг пиццерия — түлээний зуух, исгэсэн зуурмаг хоёр дээр босгосон газар.",
  },
  "story.p2": {
    en: "The dough is made by hand and left to ferment naturally. It bakes on the fire, which is why the crust comes out blistered and light rather than uniform.",
    mn: "Зуурмагийг гараар зуурч, байгалийн аргаар исгэнэ. Шууд галын дэргэд шарагддаг тул ирмэг нь жигд биш, хөнгөн хөөсөрсөн байдалтай гардаг.",
  },
  "story.p3": {
    en: "The topping list is short on purpose. What is on the pizza is what you taste.",
    mn: "Хачрын жагсаалт санаатайгаар богино. Пицца дээр байгаа зүйл л амтанд мэдрэгдэнэ.",
  },

  "admin.menu": { en: "Menu", mn: "Цэс" },
  "admin.orders": { en: "Orders", mn: "Захиалга" },
  "admin.addItem": { en: "Add an item", mn: "Хоол нэмэх" },
  "admin.addCategory": { en: "Add a category", mn: "Ангилал нэмэх" },

  "location.set": { en: "Set delivery address", mn: "Хүргэлтийн хаяг" },
  "location.title": { en: "Delivery address", mn: "Хүргэлтийн хаяг" },
  "location.placeholder": {
    en: "Street, district, landmark…",
    mn: "Гудамж, дүүрэг, барилга…",
  },
  "location.useMine": { en: "Use my current location", mn: "Одоогийн байршлыг ашиглах" },
  "location.searching": { en: "Searching…", mn: "Хайж байна…" },
  "location.clear": { en: "Clear address", mn: "Хаягийг арилгах" },
  "location.denied": {
    en: "Location permission was denied — search for the address instead.",
    mn: "Байршлын зөвшөөрөл өгөгдсөнгүй — хаягаа бичиж хайна уу.",
  },
  "location.noGeolocation": {
    en: "This browser cannot share a location.",
    mn: "Энэ хөтөч байршил илгээх боломжгүй.",
  },
  "location.confirm": { en: "Use this address", mn: "Энэ хаягийг сонгох" },
  "location.tapHint": {
    en: "Tap or drag the pin on the map to fine-tune the spot.",
    mn: "Газрын зураг дээр товшиж эсвэл цэгийг чирж байршлаа тохируулна уу.",
  },
  "location.back": { en: "Back", mn: "Буцах" },
  "location.credit": { en: "Addresses from OpenStreetMap", mn: "Хаягийн эх сурвалж: OpenStreetMap" },
  "menu.noPhoto": { en: "Photo coming", mn: "Зураг удахгүй" },
  "admin.edit": { en: "Edit", mn: "Засах" },
  "footer.rights": { en: "Poca Pizzeria · Ulaanbaatar", mn: "Poca Pizzeria · Улаанбаатар" },
};

export const translate = (key, lang) => {
  const entry = DICTIONARY[key];
  if (!entry) return key;
  return entry[lang] || entry.en;
};
