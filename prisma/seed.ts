import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const db = new PrismaClient();

async function main() {
  // Upsert categories
  const category1 = await db.category.upsert({
    where: { name: "Fiction" },
    update: {},
    create: {
      name: "Fiction",
    },
  });

  const category2 = await db.category.upsert({
    where: { name: "Non-fiction" },
    update: {},
    create: {
      name: "Non-fiction",
    },
  });

  // Upsert authors
  const author1 = await db.author.create({
    data: {
      name: "George Orwell",
      bio: "English novelist and essayist, journalist, and critic.",
    },
  });

  const author2 = await db.author.create({
    data: {
      name: "J.K. Rowling",
      bio: "British author, best known for writing the Harry Potter series.",
    },
  });
  const password = await bcrypt.hash("12345", 10);
  // Upsert users
  const atmin = await db.user.upsert({
    where: { email: "john.doe@example.com" },
    update: {},
    create: {
      name: "John Doe",
      email: "johndoe@example.com",
      password: password, // Make sure to hash the password in a real app
      role: "ADMIN", // You can change this to 'ADMIN' for an admin user
    },
  });

  const user2 = await db.user.upsert({
    where: { email: "jane.smith@example.com" },
    update: {},
    create: {
      name: "Jane Smith",
      email: "janesmith@example.com",
      password: password, // Again, hash the password in production
      role: "USER",
    },
  });
  const image =
    "https://res.cloudinary.com/da6hciwjn/image/upload/v1731601886/bookstore/file_pb5vga.jpg";
  // Upsert books
  const book1 = await db.book.create({
    data: {
      title: "1984",
      content,
      description:
        "A dystopian social science fiction novel and cautionary tale.",
      price: 19.99,
      stock: 100,
      image,
      author: {
        connect: { id: author1.id },
      },
      category: {
        connect: { id: category1.id },
      },
    },
  });

  const book2 = await db.book.create({
    data: {
      title: "Harry Potter and the Philosopher's Stone",
      description: "The first book in the Harry Potter series.",
      content,
      price: 25.99,
      stock: 50,
      image,
      author: {
        connect: { id: author2.id },
      },
      category: {
        connect: { id: category1.id },
      },
    },
  });

  // Upsert an order
  const order1 = await db.order.create({
    data: {
      userId: user2.id,
      totalPrice: 45.98, // 1984 + Harry Potter book price
    },
  });

  // Upsert order items
  const orderItems = await db.orderItem.createMany({
    data: [
      {
        orderId: order1.id,
        bookId: book1.id,
        quantity: 1,
      },
      {
        orderId: order1.id,
        bookId: book2.id,
        quantity: 1,
      },
    ],
  });

  console.log({
    category1,
    category2,
    author1,
    author2,
    atmin,
    user2,
    book1,
    book2,
    order1,
    orderItems,
  });
}
main()
  .then(() => db.$disconnect())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

var content = `Lorem ipsum odor amet, consectetuer adipiscing elit. Sit praesent nulla porttitor semper dui elementum dictumst ante curabitur? Posuere sed est sem ex sapien odio feugiat ante. Libero suscipit neque orci rutrum penatibus morbi magna. Blandit ornare conubia semper mollis, massa inceptos a. Egestas sociosqu nullam blandit dolor est, penatibus per himenaeos. Dapibus semper ullamcorper, taciti penatibus eros neque. Vestibulum primis mus; tellus potenti interdum elit.
Sollicitudin cursus enim tempus sodales iaculis convallis nibh. Aliquet dignissim cursus nam semper sollicitudin montes elementum magna nisl. In curabitur vulputate urna maecenas neque. Eros class id netus aliquam at in? Diam luctus phasellus inceptos egestas ac montes sit. Volutpat sem nunc leo penatibus laoreet aliquet tempus. Eget magna taciti vulputate montes cubilia dignissim?
In sed montes integer praesent sociosqu egestas cursus. Parturient vivamus arcu arcu mauris libero erat. Natoque euismod porttitor auctor erat auctor nisl. Aliquet lacinia tempus ad dictumst sapien. Dui leo nec nam sapien praesent natoque maecenas pellentesque primis. Malesuada inceptos conubia ut etiam lacus interdum nam. Platea nostra primis nec quis purus volutpat himenaeos. Nisi mauris potenti hendrerit, scelerisque facilisi ridiculus.
Lacus ad at per nam cursus in litora mauris justo. Quis sapien eget ad posuere leo arcu sapien. Non ornare accumsan turpis sed mattis metus nulla suspendisse. Nec etiam inceptos risus sapien lectus porttitor fermentum cursus. Netus facilisis id placerat suscipit fringilla consectetur. Aptent scelerisque senectus netus quis quam urna. Vulputate suspendisse mauris integer nunc; quis conubia. Nascetur diam vivamus purus volutpat ut varius platea scelerisque. Donec taciti mi aliquet nulla interdum purus nascetur.
Iaculis varius dapibus ultricies class eleifend ornare commodo. Nulla magnis hac neque varius conubia sagittis facilisis. Enim pharetra nisl ex potenti, leo tempor. Vulputate iaculis a id nisi purus montes hendrerit proin. Sagittis ac nisi convallis pulvinar donec mus commodo. Sapien conubia tincidunt accumsan facilisi montes risus.
Metus lectus natoque, metus litora libero eu. Montes ad placerat fusce sem sapien vivamus ante ultrices. Sagittis ante suspendisse aliquet vulputate libero purus litora netus. Eros netus taciti ultricies convallis laoreet. Erat duis magnis arcu consequat sagittis platea. Duis venenatis pulvinar nullam gravida, non amet suscipit nascetur. Volutpat inceptos felis tortor orci phasellus etiam. Lacus lobortis quis fermentum porta et.
Aenean arcu congue fames nullam at. Montes sociosqu per non dictum, felis vitae maecenas dictum. Fames arcu parturient faucibus, tristique platea cras sociosqu risus. Sociosqu ut porta fames vehicula maecenas; quisque rutrum. Vitae nam blandit purus est finibus sollicitudin odio vulputate. Vehicula porttitor massa sollicitudin venenatis massa ultrices. Quisque mollis eleifend pharetra natoque, dictum libero egestas. Senectus morbi placerat faucibus curae malesuada tortor vulputate porta. Elementum rutrum vivamus eget fames nibh amet.
Aliquam nec aliquam a sociosqu vivamus, enim penatibus. Volutpat vulputate curabitur in, efficitur facilisi proin posuere. Suspendisse etiam cubilia himenaeos nunc sit. Sociosqu magnis suspendisse senectus egestas elit purus molestie sodales aenean. Hac efficitur habitasse senectus natoque elementum a. Erat curabitur nunc mus cras platea amet dis amet ad. Sed aliquet maximus ullamcorper condimentum senectus mi congue.
Sagittis massa massa torquent sociosqu gravida. Fusce feugiat integer praesent mauris ornare duis. Hac scelerisque maecenas fusce adipiscing habitant fermentum. Fames imperdiet ad ornare; rhoncus arcu sed. Platea rutrum class vel diam bibendum tempus dis? Aliquet vulputate ullamcorper ut justo; rhoncus primis ligula.
Elit orci turpis augue facilisis per montes blandit habitasse ligula. Aliquam odio ridiculus fames vehicula; mauris tincidunt facilisi leo. Fames amet integer congue et, sociosqu suscipit molestie purus. Enim mi placerat elementum ligula curae massa sagittis ante? Rutrum dui posuere luctus rutrum auctor sed vivamus. Velit maecenas ad dui felis leo.`;
