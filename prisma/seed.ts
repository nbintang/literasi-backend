import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  // Upsert categories
  // Create Users
  const password = await bcrypt.hash('password', 10);
  
  const user = await prisma.user.upsert({
    where: {
      email: 'john.doe@example.com',
    },
    update: {}, 
    create: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password, 
    },
  });
  const user2 = await prisma.user.upsert({
    where: {
      email: 'jane.doe@example.com', 
    },
    update: {}, 
    create: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password, 
    },
  });

  
  const profile1 = await prisma.profile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      image: 'https://res.cloudinary.com/da6hciwjn/image/upload/v1731601886/bookstore/file_e1x30r.jpg',
      fullname: 'John Doe Full Name',
      bio: 'A brief bio about John Doe',
      role: "ADMIN",
      userId: user.id,
    },
  });
  
  const profile2 = await prisma.profile.upsert({
    where: { userId: user2.id },
    update: {},
    create: {
      image: 'https://res.cloudinary.com/da6hciwjn/image/upload/v1731601886/bookstore/file_e1x30r.jpg',
      fullname: 'Jane Doe Full Name',
      bio: 'A brief bio about Jane Doe',
      role: "USER",
      userId: user2.id,
    },
  });
  

  // Create Categories
  const category = await prisma.category.upsert({
    where: {
      name: 'Fiction', // Unique constraint check
    },
    update: {},
    create: {
      name: 'Fiction',
    },
  });

  // Create Books
  const book = await prisma.book.create({
    data: {
      title: 'The Great Adventure',
      description: 'A book about a great adventure.',
      price: 19.99,
      stock: 100,
      content,
      authorName: 'John Doe',
      userId: user.id, // This connects the book to the profile
      image: 'https://res.cloudinary.com/da6hciwjn/image/upload/v1731601886/bookstore/file_e1x30r.jpg',
      categories: {
        connect: { id: category.id },
      },
    },
  });

  // Create Orders
  const order = await prisma.order.create({
    data: {
      totalPrice: 19.99,
      orderedUserId: user2.id,
      orderItems: {
        create: [
          {
            bookId: book.id,
            quantity: 1,
          },
        ],
      },
    },
  });

  console.log({
    user,
    profile1,
    profile2,
    
    category,
    book,
    order,
  });
}
main()
  .then(() => prisma.$disconnect())
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
