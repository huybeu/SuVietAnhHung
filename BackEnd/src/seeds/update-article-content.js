/**
 * Script cập nhật nội dung dài hơn cho các bài viết
 * Chạy: node src/seeds/update-article-content.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') })
const { sequelize, Article } = require('../models')

const ARTICLES = [
  {
    slug: 'khoi-nghia-hai-ba-trung',
    content: `<h2>Bối Cảnh Lịch Sử — Ngàn Năm Đêm Tối</h2>
<p>Vào thế kỷ I sau Công nguyên, đất Giao Chỉ — tên gọi của miền Bắc Việt Nam thời bấy giờ — đang chìm sâu trong ách đô hộ nặng nề của nhà Đông Hán. Từ năm 111 TCN, sau khi nhà Hán tiêu diệt nước Nam Việt của nhà Triệu, đất Việt chính thức trở thành một quận của đế chế Trung Hoa, bị cai trị bởi các quan lại phương Bắc với chính sách đồng hóa triệt để.</p>
<p>Thái thú Tô Định — người cai trị Giao Chỉ vào đầu thế kỷ I — khét tiếng là kẻ tàn bạo, tham lam và độc ác. Ông ta áp đặt chế độ thuế khóa hà khắc, bắt người Việt phải học chữ Hán, mặc y phục Hán, tuân theo phong tục Hán. Bất cứ ai chống đối đều bị trừng trị thẳng tay. Các hào trưởng người Việt — những người có thực quyền ở địa phương — ngày càng bị chèn ép và thu hẹp quyền lực.</p>
<p>Dù vậy, người Việt không bao giờ quên nguồn gốc của mình. Tinh thần yêu nước âm ỉ cháy dưới lớp tro tàn áp bức, chờ đợi một ngọn gió để bùng lên thành đám cháy lớn. Và người thổi lên ngọn lửa đó chính là hai người phụ nữ gan dạ nhất lịch sử Việt Nam — Trưng Trắc và Trưng Nhị.</p>
<h2>Xuất Thân Của Hai Vị Nữ Anh Hùng</h2>
<p>Trưng Trắc và Trưng Nhị sinh ra trong một gia đình quý tộc tại Mê Linh (nay thuộc huyện Mê Linh, Hà Nội). Cha của hai bà là Lạc tướng huyện Mê Linh — một trong những chức quan cao nhất trong hệ thống hào trưởng người Việt thời Bắc thuộc. Từ nhỏ, hai bà đã được giáo dục bài bản về võ nghệ lẫn trí tuệ, nuôi dưỡng trong lòng tinh thần tự tôn dân tộc sâu sắc.</p>
<p>Trưng Trắc sau này kết hôn với Thi Sách — con trai của Lạc tướng huyện Châu Diên (nay thuộc Vĩnh Phúc). Đây là cuộc hôn nhân không chỉ gắn kết hai gia đình quý tộc lớn, mà còn liên kết hai vùng lãnh thổ rộng lớn dưới sự lãnh đạo của những người có tâm huyết chống Hán. Thi Sách và Trưng Trắc cùng nhau bí mật xây dựng lực lượng, liên kết với các hào trưởng ở nhiều vùng khác nhau, chuẩn bị cho cuộc nổi dậy lớn.</p>
<h2>Giọt Nước Tràn Ly — Cái Chết Của Thi Sách</h2>
<p>Tô Định biết tin về âm mưu khởi nghĩa. Không thể để mối nguy này phát triển, ông ta ra lệnh bắt và giết Thi Sách. Cái chết đột ngột của người chồng yêu quý không làm Trưng Trắc sụp đổ — trái lại, nó châm thêm lửa vào lòng căm thù đã âm ỉ từ lâu. Thù nhà cộng thêm nợ nước, Trưng Trắc quyết định không thể chờ đợi thêm nữa.</p>
<p>Bà lập tức triệu tập Trưng Nhị và các hào kiệt đã được vận động từ trước, tuyên bố phát lệnh khởi nghĩa. Thời điểm được chọn là mùa xuân năm 40 sau Công nguyên — khi khí trời ấm áp, lòng người sục sôi.</p>
<h2>Lời Thề Hát Môn — Bốn Điều Nguyện Ước</h2>
<p>Tại cửa sông Hát Môn (nay thuộc xã Hát Môn, huyện Phúc Thọ, Hà Nội), trước hàng nghìn nghĩa sĩ tụ họp về, Hai Bà Trưng đọc lời thề khởi nghĩa — một trong những bản tuyên ngôn đầu tiên về chí khí và lý tưởng của người Việt:</p>
<blockquote>Một xin rửa sạch nước thù<br>Hai xin dựng lại nghiệp xưa họ Hùng<br>Ba kêu oan ức lòng chồng<br>Bốn xin vẹn vẹn sở công lênh này</blockquote>
<p>Bốn điều thề này nói lên tất cả: giải phóng đất nước, khôi phục truyền thống Hùng Vương, trả thù cho Thi Sách, và hoàn thành sự nghiệp lớn. Lời thề vang lên giữa trời đất, khiến nghĩa sĩ khắp nơi rơi nước mắt và quyết tâm theo đến cùng.</p>
<h2>Cuộc Tiến Quân Thần Tốc — 65 Thành Trì Được Giải Phóng</h2>
<p>Nghĩa quân của Hai Bà Trưng bùng lên mạnh mẽ như lũ cuốn. Hào kiệt từ khắp nơi kéo về quy tụ dưới lá cờ của hai bà. Đặc biệt, có rất nhiều nữ tướng xuất sắc đã theo nghĩa quân:</p>
<p><strong>Lê Chân</strong> — người đất An Biên (Hải Phòng ngày nay) — chỉ huy một đạo quân thiện chiến, sau này được phong làm tổng trấn vùng biển Đông Bắc. <strong>Thiều Hoa</strong> — người đất Tam Nông (Phú Thọ) — nổi danh với tài cung thuật, mỗi mũi tên bắn ra đều trúng đích. <strong>Lê Thị Hoa</strong> chỉ huy kỵ binh đánh tan nhiều đồn trại Hán. Và còn hàng chục nữ tướng khác — những người phụ nữ Việt kiên cường, không kém gì nam giới trên chiến trường.</p>
<p>Tô Định không kịp trở tay. Chỉ trong vài tháng, từ mùa xuân đến mùa thu năm 40, nghĩa quân đã lần lượt giải phóng 65 thành trì trải dài khắp đất Giao Chỉ và Cửu Chân (Thanh Hóa, Nghệ An ngày nay). Tô Định kinh hoàng bỏ cả ấn tín, cạo râu, cải trang thành thường dân chạy tháo về Trung Quốc.</p>
<h2>Trưng Nữ Vương — Vị Nữ Hoàng Đầu Tiên Của Việt Nam</h2>
<p>Sau khi giải phóng toàn bộ lãnh thổ, Trưng Trắc lên ngôi vương tại Mê Linh, xưng hiệu <strong>Trưng Nữ Vương</strong>. Đây là lần đầu tiên và cũng là một trong số rất ít lần trong lịch sử Đông Nam Á, một người phụ nữ nắm quyền lãnh đạo tối cao của một quốc gia. Trưng Nhị được phong làm phó vương.</p>
<p>Trong hai năm trị vì (40–42), Trưng Nữ Vương thực hiện nhiều chính sách tiến bộ: bãi bỏ các chính sách thuế khóa hà khắc của nhà Hán, khôi phục quyền tự trị của các hào trưởng địa phương, và cố gắng xây dựng lại một xã hội Việt theo truyền thống tổ tiên để lại. Nhân dân được hưởng hai năm thái bình ngắn ngủi nhưng vô cùng quý giá sau hơn một trăm năm áp bức.</p>
<h2>Cuộc Kháng Chiến Chống Mã Viện — Bi Kịch Hát Giang</h2>
<p>Năm 42, Hán Quang Vũ Đế cử Mã Viện — một trong những danh tướng lừng lẫy nhất nhà Đông Hán — dẫn đại quân sang tái chiếm Giao Chỉ. Mã Viện không chỉ giỏi quân sự, ông ta còn là người có kinh nghiệm dày dặn trong việc đàn áp các cuộc nổi dậy. Quân Hán được trang bị tốt hơn, đông hơn và có kinh nghiệm chiến đấu nhiều hơn.</p>
<p>Hai Bà Trưng không lùi bước. Nghĩa quân chiến đấu kiên cường ở nhiều mặt trận. Trận Lãng Bạc (nay thuộc vùng Tiên Du, Bắc Ninh) là trận giao chiến lớn nhất, kéo dài nhiều tháng. Tuy nhiên, với quân số và vũ khí vượt trội, quân Hán dần dần chiếm thế thượng phong. Nghĩa quân bị đẩy lùi từng bước, rút về phía Tây và cuối cùng về đến Cẩm Khê (nay thuộc Phú Thọ).</p>
<p>Năm 43 sau Công nguyên, không muốn để bản thân rơi vào tay giặc và bị sỉ nhục, Hai Bà Trưng đã gieo mình xuống dòng sông Hát Giang tuẫn tiết. Hai bà mất khi còn rất trẻ — Trưng Trắc chưa đến 30 tuổi. Câu chuyện về hai bà kết thúc trong bi tráng, nhưng tinh thần của hai bà thì bất tử.</p>
<h2>Di Sản Ngàn Năm — Biểu Tượng Bất Diệt</h2>
<p>Dù cuộc khởi nghĩa thất bại về mặt quân sự, ý nghĩa lịch sử và văn hóa mà Hai Bà Trưng để lại là vô cùng to lớn. Lần đầu tiên sau hơn 100 năm Bắc thuộc, người Việt đã chứng minh rằng họ không bị khuất phục — rằng khát vọng tự do và độc lập vẫn cháy bỏng trong lòng mỗi người con đất Việt.</p>
<p>Ngay sau khi hai bà mất, nhân dân khắp nơi đã lập đền thờ. Đến nay, trên khắp đất nước Việt Nam có hơn 300 đền, miếu, đình thờ Hai Bà Trưng và các tướng lĩnh của hai bà. Nổi tiếng nhất là <strong>Đền Hai Bà Trưng tại Mê Linh</strong> — nơi hai bà sinh ra và phát lệnh khởi nghĩa, được xây dựng từ thế kỷ VI, nay là di tích lịch sử quốc gia đặc biệt. Hàng năm vào tháng 2 âm lịch, lễ hội Đền Hai Bà Trưng thu hút hàng vạn du khách và người hành hương từ khắp cả nước.</p>
<p>Tên của Hai Bà Trưng được đặt cho một trong những quận trung tâm của Hà Nội, hàng trăm trường học và đường phố trên cả nước. Hình ảnh hai bà cưỡi voi, tay cầm kiếm trở thành biểu tượng muôn đời của tinh thần phụ nữ Việt Nam: can đảm, kiên cường, sẵn sàng hy sinh vì đất nước. Hơn hai nghìn năm đã trôi qua, nhưng mỗi khi nhắc đến Hai Bà Trưng, người Việt Nam lại cảm thấy trong lòng dâng lên một niềm tự hào không thể nào diễn tả được.</p>`,
  },
  {
    slug: 'chien-thang-bach-dang-938',
    content: `<h2>Bối Cảnh — Đất Nước Sau Nghìn Năm Đô Hộ</h2>
<p>Năm 938, đất nước Việt Nam đang đứng trước một trong những thời khắc quyết định nhất trong lịch sử. Sau hơn một nghìn năm bị đô hộ bởi các triều đại phương Bắc — từ nhà Hán, Đông Hán, Ngô, Tấn, Tống, Tề, Lương, đến Tùy, Đường — người Việt đã nhiều lần nổi dậy nhưng chưa lần nào giành được nền độc lập thực sự lâu dài.</p>
<p>Những cuộc khởi nghĩa của Hai Bà Trưng (40–43), Bà Triệu (248), Lý Bí (544–548), Triệu Quang Phục (549–571), Mai Thúc Loan (722), Phùng Hưng (791–802)... tất cả đều thắp lên hy vọng rồi lại tắt. Dường như vận mệnh dân tộc cứ mãi lặp đi lặp lại một bi kịch đau thương. Cho đến khi Ngô Quyền xuất hiện.</p>
<h2>Ngô Quyền — Người Hùng Từ Đất Đường Lâm</h2>
<p>Ngô Quyền sinh năm 897 tại làng Đường Lâm (nay thuộc thị xã Sơn Tây, Hà Nội) — mảnh đất được mệnh danh là "đất hai vua" vì sau này cũng là nơi sinh của Phùng Hưng. Ông xuất thân trong gia đình quý tộc, từ nhỏ đã nổi tiếng về tài năng, sức mạnh phi thường và trí tuệ vượt bậc.</p>
<p>Lớn lên, Ngô Quyền trở thành tướng dưới trướng của Dương Đình Nghệ — vị hào trưởng xứ Thanh Hóa đã nổi dậy đánh đuổi quân Nam Hán năm 931, tự xưng là Tiết độ sứ cai quản đất Giao Châu. Ngô Quyền không chỉ là tướng mà còn là con rể của Dương Đình Nghệ, kết duyên với con gái người là Dương Thị. Tài năng và đức độ của Ngô Quyền được Dương Đình Nghệ hết sức tin tưởng, giao cho cai quản vùng Ái Châu (Thanh Hóa) — vùng đất giàu có và quan trọng nhất lúc bấy giờ.</p>
<h2>Kẻ Phản Bội Kiều Công Tiễn</h2>
<p>Năm 937, một sự kiện chấn động xảy ra: Kiều Công Tiễn — một trong những tướng lĩnh thân tín của Dương Đình Nghệ — đã phản bội và giết chết chủ tướng của mình để chiếm quyền lực. Đây là hành động phản phúc tàn nhẫn, vừa giết người có công ơn với mình, vừa mở đường cho quân xâm lược phương Bắc trở lại.</p>
<p>Biết rằng sức mình không đủ để đối phó với Ngô Quyền — người chắc chắn sẽ kéo quân về trả thù — Kiều Công Tiễn đã cầu cứu vua Nam Hán là Lưu Cung. Lưu Cung nhân cơ hội này lập tức sai con trai là Lưu Hoằng Tháo dẫn đại quân tiến vào xâm chiếm Giao Châu một lần nữa.</p>
<p>Ngô Quyền nhận tin, lập tức kéo quân từ Ái Châu ra Bắc với tốc độ thần tốc. Kiều Công Tiễn chưa kịp nhận được viện binh của Nam Hán đã bị Ngô Quyền tiêu diệt. Kẻ phản bội nhận kết cục xứng đáng. Nhưng bài toán khó hơn vẫn còn phía trước: đoàn chiến thuyền lớn của quân Nam Hán đang hùng hổ tiến vào cửa biển sông Bạch Đằng.</p>
<h2>Thiên Tài Bố Trận Trên Sông Bạch Đằng</h2>
<p>Sông Bạch Đằng — con sông chảy qua vùng Quảng Ninh, Hải Phòng ngày nay — là tuyến đường thủy chiến lược duy nhất để vào trung tâm Giao Châu từ hướng biển. Bất kỳ đạo quân nào muốn tiến vào bằng đường biển đều phải đi qua đây. Ngô Quyền hiểu rõ điều đó, và ông đã biến nó thành cái bẫy tử thần.</p>
<p>Kế hoạch của Ngô Quyền mang tính thiên tài ở chỗ nó khai thác tối đa yếu tố địa lý tự nhiên — cụ thể là chênh lệch thủy triều của sông Bạch Đằng. Biên độ thủy triều ở đây rất lớn, có lúc chênh nhau đến 3–4 mét. Khi nước lên, lòng sông rộng và sâu; khi nước xuống, nhiều chỗ trở thành bãi cạn lởm chởm.</p>
<p>Ngô Quyền cho quân đóng hàng nghìn cọc gỗ lim — loại gỗ rắn chắc nhất — bịt đầu sắt nhọn xuống lòng sông tại những chỗ hiểm yếu nhất. Công việc được thực hiện bí mật trong nhiều ngày. Khi thủy triều dâng cao, toàn bộ bãi cọc chìm sâu dưới nước, không thể nhìn thấy từ trên mặt sông. Đó chính là cái bẫy chết người.</p>
<h2>Diễn Biến Trận Đánh — Kỳ Tích Trên Sông Nước</h2>
<p>Lưu Hoằng Tháo dẫn đoàn chiến thuyền lớn vào cửa sông Bạch Đằng đúng vào lúc thủy triều đang lên cao nhất. Mặt sông mênh mông, nước chảy êm đềm, không có dấu hiệu gì nguy hiểm. Tướng Nam Hán tự tin tiến lên.</p>
<p>Ngô Quyền cho một đội thuyền nhỏ ra khiêu chiến. Quân Nam Hán thấy thuyền địch ít, đuổi theo hăm hở. Đội thuyền nhỏ giả vờ thua, lui dần vào sâu trong sông — lôi kéo toàn bộ đội hình địch vượt qua bãi cọc chìm, đi sâu vào vùng bẫy đã giăng sẵn.</p>
<p>Rồi nước triều bắt đầu rút. Ban đầu chậm, sau nhanh dần. Mực nước hạ xuống từng mét một. Và từ đáy sông, hàng nghìn mũi cọc sắt nhọn nhô dần lên, đâm thủng đáy những chiếc thuyền chiến hạng nặng của quân Nam Hán.</p>
<p>Lúc này, Ngô Quyền phát lệnh tổng phản công. Quân Việt từ hai bên bờ ào ào xông ra, tấn công từ nhiều hướng. Đoàn thuyền địch hỗn loạn hoàn toàn: phía trước cọc chắn không thoát được, thuyền bị đâm thủng đang chìm dần, quân địch rơi xuống sông chết đuối hàng nghìn người, còn trên bờ thì tên đạn của quân Việt bắn xuống như mưa.</p>
<p>Hoàng tử Lưu Hoằng Tháo tử trận ngay trên sông. Toàn bộ đạo quân thủy binh tinh nhuệ của Nam Hán bị tiêu diệt hoàn toàn. Vua Nam Hán Lưu Cung nghe tin con trai tử trận, đang dẫn viện binh đến giữa đường thì kinh hãi lui về. Từ đó Nam Hán không dám nhòm ngó Giao Châu nữa.</p>
<h2>Nền Độc Lập Ngàn Năm — Ý Nghĩa Vĩ Đại Của Trận Bạch Đằng</h2>
<p>Chiến thắng Bạch Đằng năm 938 chấm dứt hoàn toàn thời kỳ Bắc thuộc kéo dài hơn một nghìn năm (từ năm 111 TCN đến năm 938 SCN). Ngô Quyền lên ngôi vua, đóng đô ở Cổ Loa — kinh đô cổ của An Dương Vương — một hành động đầy tính biểu tượng: khôi phục lại ký ức về một nước Việt độc lập từ thời xa xưa.</p>
<p>Nhà sử học Lê Văn Hưu thời Trần đã đánh giá: <em>"Tiền Ngô Vương có thể lấy quân mới họp của đất Việt ta mà phá được trận giặc mạnh của Lưu Hoằng Tháo, mở nước xưng vương, làm cho người phương Bắc không dám sang lấn nữa. Có thể nói là một cơn giận mà yên được dân, mưu giỏi mà đánh cũng giỏi vậy."</em></p>
<p>Sông Bạch Đằng — con sông lịch sử — từ đó trở thành biểu tượng bất khuất của dân tộc Việt. Hơn 350 năm sau, trên chính dòng sông này, Trần Hưng Đạo lại một lần nữa sử dụng chiến thuật cọc nhọn để tiêu diệt đoàn thuyền chiến của quân Mông Nguyên năm 1288 — một sự trùng hợp lịch sử kỳ diệu, như thể những anh hùng đời trước vẫn đang phù hộ cho con cháu đời sau.</p>
<p>Ngô Quyền mất năm 944, sau 6 năm trị vì. Ông không kịp xây dựng hoàn chỉnh nền độc lập mà mình đã mở ra. Nhưng chiến thắng Bạch Đằng mà ông tạo ra mãi mãi là cột mốc vàng son, là viên đá nền đầu tiên của ngôi nhà độc lập Việt Nam — ngôi nhà mà con cháu các thế kỷ sau đã tiếp tục xây đắp và bảo vệ bằng xương máu của mình.</p>`,
  },
  {
    slug: 'tran-hung-dao-ba-lan-khang-mong',
    content: `<h2>Đế Quốc Mông Cổ — Cơn Bão Tố Từ Thảo Nguyên</h2>
<p>Thế kỷ XIII, đế quốc Mông Cổ của Thành Cát Tư Hãn và con cháu đã trở thành đế chế lớn nhất trong lịch sử nhân loại, trải dài từ Thái Bình Dương đến tận Đông Âu. Kỵ binh Mông Cổ — những chiến binh sinh ra trên lưng ngựa, được tôi luyện bởi gió lạnh thảo nguyên — không biết thất bại. Ba Tư, Trung Quốc, Nga, Ba Lan, Hungary... tất cả đều phủ phục trước vó ngựa Mông Cổ. Không quốc gia nào có thể cản được sức mạnh quân sự vô địch này — cho đến khi gặp Đại Việt.</p>
<p>Giữa cơn bão tố đó, một người đứng lên gánh vác trọng trách bảo vệ đất nước: <strong>Trần Quốc Tuấn</strong>, tức Trần Hưng Đạo — vị tướng được hậu thế tôn xưng là thiên tài quân sự vĩ đại nhất lịch sử Việt Nam.</p>
<h2>Trần Hưng Đạo — Con Người Vượt Lên Thù Hận</h2>
<p>Trần Quốc Tuấn sinh năm 1228, là con trai của An Sinh Vương Trần Liễu — anh trai của vua Trần Thái Tông. Tuổi thơ của ông không êm ả: cha ông vì mâu thuẫn với triều đình mà luôn ấp ủ lòng thù hận. Trước khi mất, Trần Liễu từng nắm tay con trai mà dặn dò phải trả thù cho mình.</p>
<p>Đây là một gánh nặng khổng lồ mà Trần Hưng Đạo phải mang theo suốt đời. Nhưng khi đất nước đứng trước nguy cơ xâm lăng của quân Mông Nguyên, ông đã chọn đặt lợi ích dân tộc lên trên thù riêng. Câu trả lời của ông cho vua Trần Nhân Tông khi được hỏi về việc có nên hàng giặc để tránh máu đổ hay không đã trở thành bất hủ:</p>
<blockquote>Bệ hạ chém đầu thần trước rồi hãy hàng!</blockquote>
<p>Đó là con người Trần Hưng Đạo — một người có thể vượt qua thù riêng để đặt nghĩa lớn lên trên hết.</p>
<h2>Hịch Tướng Sĩ — Áng Hùng Văn Muôn Đời</h2>
<p>Trước lần kháng chiến thứ hai (1285), Trần Hưng Đạo viết <em>Hịch tướng sĩ văn</em> — một trong những áng văn yêu nước xuất sắc nhất mọi thời đại, không chỉ của Việt Nam mà của cả nhân loại. Ông viết bằng tất cả tấm lòng của một người yêu nước, một vị tướng lo lắng cho vận mệnh dân tộc:</p>
<blockquote>Ta thường tới bữa quên ăn, nửa đêm vỗ gối, ruột đau như cắt, nước mắt đầm đìa; chỉ giận chưa thể xé thịt lột da, nuốt gan uống máu quân thù. Dẫu cho trăm thân ta phơi ngoài nội cỏ, nghìn xác ta bọc trong da ngựa, ta cũng vui lòng.</blockquote>
<p>Hịch tướng sĩ không chỉ là bài văn khích lệ tinh thần, mà còn là lời vạch mặt những kẻ sống hèn nhát, chỉ biết vui chơi hưởng lạc trong khi đất nước lâm nguy. Sau khi nghe Hịch, các tướng lĩnh và quân sĩ Đại Việt đều sôi sục khí thế, tay khắc lên cánh tay hai chữ "Sát Thát" (giết giặc Mông Cổ) — một trong những hình ảnh xúc động nhất trong lịch sử kháng chiến Việt Nam.</p>
<h2>Lần Thứ Nhất — 1258: Bài Học Đầu Tiên</h2>
<p>Năm 1258, quân Mông Cổ lần đầu xâm lược Đại Việt, theo đường bộ từ Vân Nam xuống. Vua Trần Thái Tông đích thân ra trận. Quân Việt ban đầu thất thế, phải thực hiện kế sách rút lui để bảo toàn lực lượng — đây là lần đầu tiên chiến thuật "vườn không nhà trống" được áp dụng một cách hệ thống.</p>
<p>Quân Mông Cổ chiếm được Thăng Long nhưng chỉ thấy một kinh thành trống rỗng, không có lương thực, không có của cải. Trong điều kiện khí hậu nhiệt đới nóng ẩm khác hoàn toàn với thảo nguyên lạnh giá, quân Mông Cổ nhanh chóng kiệt sức vì bệnh tật và thiếu lương thực. Chỉ sau gần hai tháng, chúng buộc phải rút lui. Quân Đại Việt phản công, đánh nhiều trận thắng lợi khi địch đang rút.</p>
<h2>Lần Thứ Hai — 1285: Cuộc Chiến Sinh Tử</h2>
<p>Năm 1285, quân Nguyên Mông lần thứ hai xâm lược Đại Việt với lực lượng lớn hơn nhiều: khoảng 50 vạn quân do Thoát Hoan — con trai của Hốt Tất Liệt — chỉ huy, đồng thời với một đạo quân khác từ phía Nam do Toa Đô dẫn từ Chiêm Thành đánh lên. Đây là cuộc xâm lược toàn diện nhất, nguy hiểm nhất.</p>
<p>Trần Hưng Đạo tiếp tục áp dụng chiến lược linh hoạt: khi thế địch mạnh thì rút lui, không để bị tiêu diệt trong trận đánh trực tiếp; khi địch suy yếu vì thiếu lương thực và bệnh tật thì phản công quyết liệt. Vua tôi nhà Trần rút về vùng biển, chịu đựng gian khổ cùng quân dân.</p>
<p>Trong giai đoạn khó khăn nhất, tại Hội nghị Bình Than (1282) và Hội nghị Diên Hồng (1284), toàn quân và dân đã đồng lòng hô vang một tiếng: <em>"Đánh!"</em>. Tinh thần đó — cả nước một lòng — chính là vũ khí mạnh nhất của Đại Việt.</p>
<p>Sau nhiều tháng chiến đấu, quân Nguyên Mông kiệt sức. Trần Hưng Đạo phát động tổng phản công vào mùa hè năm 1285. Trận Hàm Tử, trận Chương Dương, trận Tây Kết nối tiếp nhau. Toa Đô tử trận. Thoát Hoan phải chui vào ống đồng để chạy thoát thân — một hình ảnh nhục nhã đáng đời kẻ xâm lược.</p>
<h2>Lần Thứ Ba — 1287-1288: Chiến Thắng Bạch Đằng Lịch Sử</h2>
<p>Hốt Tất Liệt không chấp nhận thất bại. Năm 1287, ông ta cử đại quân lần thứ ba xâm lược, lần này với lực lượng thủy quân cực kỳ mạnh để tránh điểm yếu về lương thực — đoàn thuyền lương của Trương Văn Hổ chở theo lương thực đủ dùng cho hàng chục vạn quân trong nhiều tháng.</p>
<p>Trần Hưng Đạo ra tay ngay từ đầu: cho quân phục kích và tiêu diệt toàn bộ đoàn thuyền lương của Trương Văn Hổ trên sông Vân Đồn (trận Vân Đồn). Không có lương thực, quân Nguyên Mông lại rơi vào thế bất lợi hoàn toàn.</p>
<p>Mùa xuân 1288, trên dòng sông Bạch Đằng lịch sử — nơi Ngô Quyền đã dùng cọc nhọn tiêu diệt quân Nam Hán 350 năm trước — Trần Hưng Đạo lại một lần nữa dùng chính kế sách đó. Hàng nghìn cọc gỗ lim bịt sắt nhọn được đóng xuống lòng sông.</p>
<p>Đô đốc Ô Mã Nhi dẫn đoàn thuyền chiến Nguyên Mông tiến vào lúc thủy triều dâng. Quân Việt nhử địch vào sâu. Khi thủy triều rút, cọc nhô lên, thuyền địch mắc cạn, bị đâm thủng, chìm hàng loạt. Ô Mã Nhi bị bắt sống. Thoát Hoan một lần nữa chạy tháo thân về Trung Quốc. Đại Việt đại thắng lần thứ ba.</p>
<h2>Binh Thư Yếu Lược — Di Sản Quân Sự Vô Giá</h2>
<p>Trần Hưng Đạo không chỉ là vị tướng tài ba trên chiến trường, ông còn là nhà lý luận quân sự xuất sắc. Tác phẩm <em>Binh thư yếu lược</em> của ông tổng kết kinh nghiệm chiến đấu, đúc kết những nguyên lý quân sự mà ông đã áp dụng thành công. Cho đến nay, đây vẫn là tài liệu được nghiên cứu và trân trọng.</p>
<p>Trước khi mất (năm 1300), khi vua Trần Anh Tông hỏi về kế sách giữ nước, Trần Hưng Đạo đã để lại những lời vàng ngọc: <em>"Phải khoan thư sức dân để làm kế sâu rễ bền gốc, đó là thượng sách giữ nước vậy."</em> Câu nói đó vẫn còn nguyên giá trị đến tận hôm nay.</p>
<p>Sau khi mất, Trần Hưng Đạo được nhân dân tôn thờ như một vị thần — "Đức Thánh Trần". Đền Kiếp Bạc (Hải Dương) — nơi ông từng đặt đại bản doanh — trở thành một trong những nơi linh thiêng bậc nhất Việt Nam, thu hút hàng triệu người hành hương mỗi năm. Tên tuổi và hình ảnh của ông mãi mãi là niềm tự hào và biểu tượng của bản lĩnh dân tộc Việt Nam.</p>`,
  },
  {
    slug: 'dai-pha-quan-thanh-quang-trung',
    content: `<h2>Tình Thế Ngàn Cân Treo Sợi Tóc</h2>
<p>Cuối năm 1788, đất nước Đại Việt đứng trước một cuộc khủng hoảng sâu sắc. Vua Lê Chiêu Thống — ông vua cuối cùng của triều Hậu Lê đã tồn tại gần 400 năm — vì quá hèn nhát và thiển cận đã chạy sang cầu cứu nhà Thanh, chấp nhận dẫn quân xâm lược vào giày xéo đất tổ tiên. Tổng đốc Lưỡng Quảng Tôn Sĩ Nghị dẫn đại quân gồm 29 vạn binh sĩ chia thành 4 đạo tràn qua biên giới, nhanh chóng chiếm đóng Thăng Long.</p>
<p>Quân Tây Sơn ở Bắc Hà dưới quyền Ngô Văn Sở chỉ có vài vạn người, không đủ sức chống đỡ. Họ phải thực hiện kế sách rút lui chiến lược về phía Nam để bảo toàn lực lượng. Thăng Long thất thủ. Quân Thanh dương dương tự đắc, cho rằng đã nắm chắc phần thắng trong tay.</p>
<p>Nhưng ở Phú Xuân (Huế), một người đàn ông 35 tuổi đang nghiền ngẫm bản đồ với đôi mắt sáng rực lửa. Người đó là Nguyễn Huệ — và ông không bao giờ chấp nhận thất bại.</p>
<h2>Lễ Đăng Quang Và Lời Thề Bắc Tiến</h2>
<p>Ngày 25 tháng 11 năm 1788, tại núi Bân (nay thuộc thành phố Huế), Nguyễn Huệ làm lễ tế cáo trời đất, lên ngôi hoàng đế, lấy niên hiệu Quang Trung. Nghi lễ đăng quang được tổ chức giản dị, không phô trương — bởi người ta hiểu rằng không có thời gian cho những nghi thức dài dòng. Đất nước đang cần được giải phóng.</p>
<p>Ngay trong buổi lễ, Hoàng đế Quang Trung tuyên bố với tướng sĩ:</p>
<blockquote>Đánh cho để dài tóc<br>Đánh cho để đen răng<br>Đánh cho nó chích luân bất phản<br>Đánh cho nó phiến giáp bất hoàn<br>Đánh cho sử tri Nam quốc anh hùng chi hữu chủ</blockquote>
<p>Lời hịch đanh như sấm. "Đánh cho nó không còn một chiếc bánh xe quay về, không còn một mảnh giáp trở lại" — đó là tuyên ngôn của một người đã quyết tâm đánh đến cùng. Và "đánh cho sử sách biết rằng nước Nam anh hùng có chủ" — đó là lời khẳng định về chủ quyền và bản lĩnh dân tộc.</p>
<h2>Hành Quân Thần Tốc — Kỳ Tích Trong Lịch Sử Quân Sự</h2>
<p>Từ Phú Xuân (Huế) đến Thăng Long (Hà Nội) là khoảng 700 km đường bộ. Đại quân Tây Sơn — khoảng 10 vạn người — hành quân cả ngày lẫn đêm, không nghỉ. Dọc đường, tại Nghệ An và Thanh Hóa, hàng vạn thanh niên trai tráng tự nguyện tòng quân, được phiên chế vào đội hình tại chỗ. Quân đội vừa đi vừa lớn mạnh.</p>
<p>Đây là một trong những cuộc hành quân nhanh nhất trong lịch sử quân sự thế giới thời tiền công nghiệp. Hoàng đế Quang Trung đã tính toán rằng quân Thanh đang say sưa ăn Tết Nguyên Đán — đây là thời điểm vàng để tấn công bất ngờ. Mọi thứ phải được thực hiện trong bí mật tuyệt đối và với tốc độ tối đa.</p>
<p>Để giải quyết bài toán mệt mỏi trong hành quân dài ngày, Quang Trung áp dụng một phương pháp đặc biệt: cho binh lính ngủ trên những chiếc cáng do người khác khiêng, thay nhau nghỉ ngơi trong khi đại quân vẫn tiến. Cách làm đơn giản nhưng thiên tài này đảm bảo quân sĩ đến nơi vẫn còn đủ sức chiến đấu.</p>
<h2>Trận Hà Hồi — Mở Màn Thần Tốc</h2>
<p>Đêm 28 Tết (đêm 24 tháng 1 năm 1789), quân Tây Sơn vây đồn Hà Hồi (Thường Tín, Hà Nội). Thay vì tấn công ngay, Quang Trung sử dụng chiến thuật tâm lý: cho quân la hét ầm ĩ xung quanh đồn, tạo ảo giác lực lượng cực kỳ đông đảo. Quân Thanh trong đồn kinh hoàng, không dám chống cự, xin đầu hàng. Toàn bộ quân lương và vũ khí trong đồn bị thu chiếm — đây là nguồn tiếp tế quan trọng cho cuộc tiến công tiếp theo.</p>
<h2>Trận Ngọc Hồi — Trận Đánh Quyết Định</h2>
<p>Đêm mùng 4 rạng sáng mùng 5 Tết Kỷ Dậu (đêm 29 tháng 1 năm 1789), Hoàng đế Quang Trung đích thân chỉ huy cánh quân chủ lực tấn công đồn Ngọc Hồi — tuyến phòng thủ mạnh nhất, then chốt nhất của quân Thanh, nằm cách Thăng Long khoảng 14 km về phía Nam.</p>
<p>Quân Thanh tại Ngọc Hồi có hàng chục khẩu đại bác và hàng nghìn binh lính thiện chiến. Họ nhất định không để mất vị trí này. Nhưng Quang Trung đã có cách đối phó: cho quân dùng những tấm ván gỗ lớn quấn rơm ướt để chắn đạn, tiến dần đến gần đồn. Dưới màn đêm mùng 5 Tết, trong tiếng pháo mừng năm mới vẫn còn vang vọng đâu đó xa xa, quân Tây Sơn như những bóng ma lao thẳng vào công sự của địch.</p>
<p>Trận chiến diễn ra ác liệt nhưng ngắn ngủi. Đồn Ngọc Hồi thất thủ. Hàng nghìn quân Thanh bị tiêu diệt. Tàn quân bỏ chạy tán loạn.</p>
<h2>Gò Đống Đa — Kết Cục Của Kẻ Xâm Lược</h2>
<p>Cùng lúc đó, ở mặt trận Đống Đa (nay là quận Đống Đa, Hà Nội), cánh quân Tây Sơn do đô đốc Đặng Tiến Đông chỉ huy tấn công vào đại doanh của Sầm Nghi Đống — tướng giữ Thăng Long. Sầm Nghi Đống không ngờ quân Việt tiến đến nhanh như vậy. Trong cơn hoảng loạn, ông ta đã thắt cổ tự vẫn. Xác quân Thanh chất thành gò — đó chính là Gò Đống Đa mà người Hà Nội còn nhắc đến mãi đến ngày nay.</p>
<p>Tôn Sĩ Nghị nghe tin thất thủ, không kịp mặc giáp, bỏ cả ấn tín lẫn đồ vật, chạy tháo ra cầu phao bắc qua sông Nhị (sông Hồng) để chạy về phương Bắc. Quân Thanh tranh nhau chạy, cầu phao quá tải bị gãy, hàng vạn quân Thanh chết đuối xuống sông Nhị. Dòng sông đỏ thắm màu máu giặc.</p>
<h2>Khải Hoàn — Mùng 5 Tết Sống Mãi Trong Ký Ức</h2>
<p>Sáng mùng 5 Tết Kỷ Dậu 1789, Hoàng đế Quang Trung trên mình ngựa chiến, áo bào đen sạm khói súng, dẫn đại quân tiến vào Thăng Long trong tiếng reo hò vang trời của hàng vạn người dân. Từ lúc xuất phát ở Phú Xuân đến lúc vào Thăng Long, chỉ vỏn vẹn 40 ngày — kỳ tích chưa từng có trong lịch sử.</p>
<p>Quang Trung đã hẹn với các tướng sĩ rằng đến mùng 7 Tết sẽ ăn mừng chiến thắng tại Thăng Long. Nhưng ông về sớm hơn hai ngày so với kế hoạch — bởi với thiên tài quân sự và tốc độ hành quân phi thường, ông đã vượt qua cả những dự tính tốt nhất của chính mình.</p>
<p>Chiến thắng Đống Đa — mùng 5 Tết Kỷ Dậu 1789 — mãi mãi là một trong những trang sử huy hoàng nhất của dân tộc Việt Nam. Hàng năm, lễ hội Đống Đa được tổ chức tại Hà Nội để tưởng nhớ chiến công vĩ đại của Hoàng đế Quang Trung và đại quân Tây Sơn — những người con ưu tú đã bảo vệ đất nước và khẳng định rằng nước Nam anh hùng luôn có chủ.</p>`,
  },
  {
    slug: 'khoi-nghia-lam-son',
    content: `<h2>Nhà Minh Đô Hộ — Hai Mươi Năm Đêm Đen</h2>
<p>Năm 1407, sau khi tiêu diệt nhà Hồ, nhà Minh đặt ách đô hộ lên toàn bộ đất Đại Ngu (Việt Nam). Khác với các triều đại Bắc thuộc trước, nhà Minh thực hiện chính sách đồng hóa quyết liệt và tàn bạo chưa từng thấy: đốt sách, phá hủy các công trình văn hóa, cưỡng bức người Việt ăn mặc và sinh sống theo phong tục Trung Quốc, bắt hàng vạn người thợ giỏi và trí thức sang Trung Quốc.</p>
<p>Thuế khóa nặng nề đến mức người dân không thể nào gánh nổi. Những ai chống đối đều bị giết. Các mỏ vàng, bạc, khoáng sản quý bị khai thác kiệt quệ. Rừng quý bị chặt hạ, thú vật quý bị bắt về phương Bắc. Đất Việt như bị rút ruột từng ngày.</p>
<p>Tuy nhiên, hai mươi năm đô hộ không thể xóa được bản sắc dân tộc Việt. Người Việt vẫn giữ tiếng nói, vẫn truyền cho con cháu những câu chuyện về Hùng Vương, về Trưng Vương, về Ngô Quyền, về Trần Hưng Đạo... Ngọn lửa yêu nước cháy âm ỉ, chờ ngày bùng lên.</p>
<h2>Lê Lợi — Người Hùng Áo Vải</h2>
<p>Lê Lợi sinh năm 1385 tại Lam Sơn (nay thuộc huyện Thọ Xuân, Thanh Hóa) trong một gia đình hào phú. Ông không xuất thân từ dòng dõi vua chúa hay quan lại cao cấp — ông là con người của đất đai, của nhân dân lao động. Điều đó khiến ông hiểu sâu sắc nỗi thống khổ của người dân hơn bất kỳ ai.</p>
<p>Nhà Minh biết đến tài năng của Lê Lợi, nhiều lần chiêu mộ ông vào làm quan. Ông kiên quyết từ chối. Thay vào đó, ông âm thầm xây dựng lực lượng, tích trữ lương thực, luyện tập binh mã tại Lam Sơn. Ông kết giao với các hào kiệt khắp nơi, vận động người có tài và lòng yêu nước.</p>
<h2>Nguyễn Trãi — Người Thầy Mưu Lược</h2>
<p>Trong cuộc đời Lê Lợi, không thể không nhắc đến Nguyễn Trãi — người đã trở thành cánh tay phải, người thầy mưu lược không thể thiếu của cuộc khởi nghĩa Lam Sơn. Nguyễn Trãi (1380–1442) là con của Nguyễn Phi Khanh — một quan to của nhà Hồ bị nhà Minh bắt đưa sang Trung Quốc. Ông từng đi theo để chăm sóc cha, nhưng cuối cùng buộc phải quay về với lời nhắn của cha: "Hãy về lo trả thù nhà đền nợ nước."</p>
<p>Sau nhiều năm chờ đợi, Nguyễn Trãi tìm đến Lê Lợi và dâng lên bản <em>Bình Ngô sách</em> — một chiến lược tổng thể cho cuộc kháng chiến. Ông đề xuất đường lối nổi tiếng:</p>
<blockquote>Lấy nhân nghĩa thắng hung tàn, lấy chí nhân thay cường bạo.</blockquote>
<p>Đây không chỉ là chiến thuật quân sự mà là triết lý cai trị và chiến đấu: không chỉ thắng bằng vũ lực, mà phải thắng bằng chính nghĩa, bằng lòng dân. Lê Lợi nhận ra ngay giá trị của Nguyễn Trãi và coi ông như tri kỷ.</p>
<h2>Mười Năm Nếm Mật Nằm Gai</h2>
<p>Năm 1418, Lê Lợi chính thức phát lệnh khởi nghĩa tại Lam Sơn, tự xưng là Bình Định Vương. Ban đầu, lực lượng chỉ có vài trăm người. Những năm đầu là giai đoạn khổ cực nhất: quân Minh liên tục truy quét, nghĩa quân phải lên núi Chí Linh (Thanh Hóa) ẩn thân ba lần, chịu đói khát, chịu rét, nhiều lần tưởng như tan vỡ.</p>
<p>Có những thời điểm tình thế nguy cấp đến mức Lê Lợi phải sai người giả vờ đầu hàng để trì hoãn quân địch. Có lúc thiếu lương thực đến mức phải ăn vỏ cây, củ rừng. Nhưng Lê Lợi không bao giờ bỏ cuộc. Ông nói với tướng sĩ: <em>"Ta với các ngươi đã cùng nhau thề nguyện đồng tâm hiệp lực, vì nước mà chiến đấu. Dù gian khổ đến đâu cũng không nản lòng."</em></p>
<p>Dần dần, lực lượng lớn mạnh. Nhiều tướng tài gia nhập: Nguyễn Xí dũng mãnh, Đinh Lễ mưu lược, Lê Văn An trung thành, Lê Sát cương nghị... Vùng giải phóng ngày càng mở rộng từ Thanh Hóa vào đến Nghệ An, rồi tiến ra Bắc từng bước một.</p>
<h2>Bước Ngoặt — Giải Phóng Từ Nam Ra Bắc</h2>
<p>Từ năm 1424, chiến lược của nghĩa quân Lam Sơn thay đổi căn bản: thay vì đánh cầm cự ở Thanh Hóa, Lê Lợi nghe theo lời Nguyễn Chích đề xuất tiến vào phía Nam trước, lấy Nghệ An làm bàn đạp. Chiến lược này đúng đắn: Nghệ An là vùng đất rộng lớn, nhân dân căm thù giặc Minh sâu sắc, dễ huy động lực lượng.</p>
<p>Trong hai năm 1424–1426, nghĩa quân Lam Sơn liên tiếp thắng trận lớn. Trận Khả Lưu, trận Bồ Ải, trận Trà Lân... Nghĩa quân giải phóng toàn bộ từ Thanh Hóa đến tận Thuận Hóa (Thừa Thiên). Sau đó tiến ra Bắc, vây hãm Đông Quan (Hà Nội) và các thành lũy của giặc Minh.</p>
<h2>Bình Ngô Đại Cáo — Tuyên Ngôn Độc Lập Bất Hủ</h2>
<p>Cuối năm 1427, quân Minh bị bao vây tứ bề. Hai đạo viện binh của nhà Minh bị đánh tan tại Chi Lăng và Xương Giang (Bắc Giang). Tướng Liễu Thăng tử trận. Vương Thông trong thành Đông Quan biết không còn hy vọng, xin giảng hòa.</p>
<p>Lê Lợi — thể hiện tấm lòng nhân nghĩa phi thường — đồng ý cho toàn bộ quân Minh về nước an toàn. Ông cấp lương thực, thuyền bè cho họ. Hành động đó không phải là sự nhu nhược, mà là sự tự tin của người chiến thắng: không cần phải tàn sát kẻ thù đã đầu hàng, bởi điều đó chỉ gây thêm thù hận mà không đem lại lợi ích lâu dài.</p>
<p>Đầu năm 1428, Nguyễn Trãi thừa lệnh Lê Lợi viết <em>Bình Ngô Đại Cáo</em> — được đọc lên tại Đông Đô, công bố với toàn dân nền độc lập của đất nước:</p>
<blockquote>Như nước Đại Việt ta từ trước,<br>Vốn xưng nền văn hiến đã lâu.<br>Núi sông bờ cõi đã chia,<br>Phong tục Bắc Nam cũng khác.</blockquote>
<p><em>Bình Ngô Đại Cáo</em> được đánh giá là bản tuyên ngôn độc lập hùng tráng nhất trong lịch sử dân tộc — một áng văn vừa là văn học vừa là lịch sử, vừa là pháp lý vừa là triết học. Nó khẳng định rằng Đại Việt là một quốc gia độc lập, có văn hóa riêng, lịch sử riêng, lãnh thổ riêng — và không một thế lực nào có quyền xóa bỏ điều đó.</p>`,
  },
  {
    slug: 'nam-quoc-son-ha-tuyen-ngon-doc-lap',
    content: `<h2>Lý Thường Kiệt — Vị Tướng Kiêm Nhà Thơ</h2>
<p>Lý Thường Kiệt (1019–1105), tên thật là Ngô Tuấn, là một trong những nhân vật vĩ đại nhất triều đại nhà Lý và của cả lịch sử Việt Nam. Ông vừa là một danh tướng đánh đâu thắng đó, vừa là nhà thơ để lại tác phẩm được coi là bản Tuyên ngôn độc lập đầu tiên của dân tộc. Sự kết hợp giữa tài năng quân sự và tầm nhìn văn hóa khiến ông trở thành nhân vật không thể thay thế trong lịch sử.</p>
<p>Bước vào triều đình từ khi còn trẻ, Lý Thường Kiệt dần dần leo lên vị trí cao nhất trong hàng võ tướng. Ông được vua Lý Thánh Tông tin tưởng giao cho nhiều trọng trách, từ việc cai quản biên cương đến điều hành quân đội. Dưới thời vua Lý Nhân Tông, ông trở thành người quyền lực nhất triều đình, nắm trong tay cả quyền dân sự lẫn quân sự.</p>
<h2>Bối Cảnh — Nhà Tống Âm Mưu Xâm Lược</h2>
<p>Vào những năm 1070, nhà Tống đang trong giai đoạn cải cách theo chính sách của Vương An Thạch. Một trong những mục tiêu của cải cách là tăng cường ảnh hưởng ra bên ngoài. Một số quan chức nhà Tống nhìn về phía Nam, thấy Đại Việt đang ngày càng lớn mạnh dưới triều Lý, bắt đầu lên kế hoạch xâm chiếm.</p>
<p>Lý Thường Kiệt nắm được tin tức này qua mạng lưới tình báo. Ông nhận ra: ngồi chờ địch đến là tự đặt mình vào thế bất lợi. Kế tốt nhất là chủ động tấn công phủ đầu, phá hủy căn cứ xuất phát của địch trước khi chúng kịp chuẩn bị.</p>
<h2>Cuộc Tấn Công Phủ Đầu — Đánh Vào Đất Tống</h2>
<p>Năm 1075, Lý Thường Kiệt dẫn đại quân hơn 10 vạn người, kết hợp cả bộ binh và thủy binh, bất ngờ tấn công vào đất Tống. Đây là lần hiếm hoi trong lịch sử khi quân Việt chủ động tiến công vào lãnh thổ phương Bắc — một quyết định táo bạo và đúng đắn.</p>
<p>Quân Việt tấn công và chiếm các châu Khâm, Liêm, Ung (nay thuộc tỉnh Quảng Tây, Trung Quốc). Châu Ung — trung tâm tập kết quân và lương thực của nhà Tống chuẩn bị cho cuộc xâm lược — bị hạ sau 42 ngày vây hãm. Tướng nhà Tống là Tô Giám chết trong đống lửa. Toàn bộ kho lương và căn cứ quân sự bị phá hủy.</p>
<p>Sau khi hoàn thành mục tiêu, Lý Thường Kiệt rút quân về nước, chuẩn bị chiến tuyến phòng thủ cho cuộc phản kích tất yếu của nhà Tống.</p>
<h2>Phòng Tuyến Sông Như Nguyệt — Trường Thành Trên Nước</h2>
<p>Lý Thường Kiệt lựa chọn sông Như Nguyệt (sông Cầu ngày nay, chảy qua Bắc Ninh và Bắc Giang) làm tuyến phòng thủ chủ yếu. Ông cho xây dựng một hệ thống phòng thủ kiên cố dọc theo bờ Nam sông: tường đất, hào sâu, cung thủ bố trí dày đặc. Đây là công trình quân sự vĩ đại, được gọi là "phòng tuyến Như Nguyệt" — một trong những công trình phòng thủ xuất sắc nhất lịch sử Đông Nam Á thời trung đại.</p>
<p>Năm 1076, đại quân Tống do Quách Quỳ chỉ huy hơn 30 vạn người tiến đến bờ Bắc sông Như Nguyệt. Hai bên giằng co quyết liệt. Quách Quỳ nhiều lần tìm cách vượt sông nhưng đều bị đánh lui. Quân Tống bắt đầu nản lòng vì không thể phá vỡ phòng tuyến kiên cố.</p>
<h2>Bài Thơ Thần — Đêm Sông Như Nguyệt Huyền Bí</h2>
<p>Theo sách <em>Việt điện u linh</em> và <em>Lĩnh Nam chích quái</em>, vào một đêm trong giai đoạn giằng co ác liệt nhất, từ trong đền thờ thần sông (thần Trương Hống, Trương Hát — hai vị thần của sông Như Nguyệt) vang lên tiếng thơ hùng hồn:</p>
<blockquote>Nam quốc sơn hà Nam đế cư<br>Tiệt nhiên định phận tại thiên thư<br>Như hà nghịch lỗ lai xâm phạm<br>Nhữ đẳng hành khan thủ bại hư</blockquote>
<p><em>Dịch nghĩa: Núi sông nước Nam, vua Nam ngự trị / Rành rành định phận tại sách trời / Cớ sao lũ giặc dám xâm phạm / Chúng mày ắt sẽ chuốc bại vong.</em></p>
<p>Nhiều nhà nghiên cứu cho rằng chính Lý Thường Kiệt là tác giả bài thơ, và ông đã sử dụng nó như một chiến thuật tâm lý chiến — cho người đọc thơ lên từ đền thờ trong đêm tối để tạo hiệu ứng thần kỳ, khích lệ tinh thần quân sĩ và làm lung lay ý chí kẻ thù. Dù thực hư thế nào, hiệu quả là rõ ràng: quân Việt sôi sục khí thế, quân Tống thêm run sợ.</p>
<h2>Ý Nghĩa Lịch Sử — Tuyên Ngôn Độc Lập Đầu Tiên</h2>
<p>Bài thơ "Nam quốc sơn hà" là bản tuyên ngôn chủ quyền lãnh thổ đầu tiên của Việt Nam được ghi lại trong lịch sử. Nó khẳng định ba điều cốt lõi: đất Nam là của người Nam (không phải của người Bắc); quyền đó được "trời" (thiên lý, đạo lý) công nhận; và bất cứ kẻ nào xâm phạm đều sẽ thất bại.</p>
<p>Sáu trăm năm sau, năm 1428, Nguyễn Trãi viết <em>Bình Ngô Đại Cáo</em> — tuyên ngôn độc lập thứ hai. Và năm 1945, Hồ Chí Minh đọc <em>Tuyên ngôn độc lập</em> — tuyên ngôn thứ ba. Cả ba văn bản này đều nối tiếp nhau trong một dòng chảy lịch sử: khẳng định sự tồn tại độc lập, có chủ quyền của dân tộc Việt Nam.</p>
<h2>Phản Công Đêm — Kết Thúc Chiến Tranh</h2>
<p>Sau nhiều tháng giằng co, Lý Thường Kiệt phát động một đợt phản công bất ngờ vào ban đêm — vượt sông đánh thẳng vào trại giặc. Quân Tống không kịp phòng bị, bị đánh tan tác. Quách Quỳ — trước đây hùng hổ muốn nuốt chửng Đại Việt — nay phải cúi đầu xin giảng hòa và rút quân về nước.</p>
<p>Lý Thường Kiệt chủ động đề nghị giảng hòa — không truy đuổi đến cùng — bởi ông hiểu rằng tiêu diệt hoàn toàn quân Tống sẽ chỉ làm nhà Tống tức giận và tìm cách trả thù. Mục tiêu đã đạt được: bảo vệ được đất nước, thể hiện sức mạnh đủ để nhà Tống phải tôn trọng. Đó là đủ.</p>
<p>Lý Thường Kiệt sống đến 87 tuổi — tuổi thọ hiếm có thời bấy giờ — và dành phần lớn cuộc đời cho đất nước. Ông mất năm 1105, để lại một di sản vô song: người đã viết bản tuyên ngôn độc lập đầu tiên, người đã đánh bại một trong những cường quốc lớn nhất thế giới lúc bấy giờ, và người đã chứng minh rằng trí tuệ và chính nghĩa mạnh hơn bạo lực và tham lam.</p>`,
  },
  {
    slug: 'dinh-bo-linh-dep-loan-12-su-quan',
    content: `<h2>Đất Nước Sau Cái Chết Của Ngô Quyền</h2>
<p>Năm 944, Ngô Quyền — người anh hùng đã chấm dứt ngàn năm Bắc thuộc — qua đời khi mới 47 tuổi, để lại đất nước chưa kịp ổn định. Ngô Quyền có hai con trai là Ngô Xương Ngập và Ngô Xương Văn còn nhỏ tuổi. Quyền lực rơi vào tay Dương Tam Kha — người anh vợ của Ngô Quyền — tự lập làm Bình Vương, cai trị bằng bạo lực.</p>
<p>Sự sụp đổ của quyền lực trung ương như tháo vỡ một con đập. Khắp nơi, các hào trưởng địa phương thấy cơ hội liền nổi dậy cát cứ. Đất nước tan vỡ thành 12 mảnh, mỗi mảnh là lãnh địa của một sứ quân riêng. Người dân lại rơi vào cảnh chiến tranh liên miên: mùa màng bị tàn phá, nhà cửa bị đốt, người thân bị giết. Hai mươi năm hỗn loạn (944–968) là hai mươi năm khổ ải tột cùng của nhân dân.</p>
<h2>Mười Hai Sứ Quân Và Cục Diện Chia Cắt</h2>
<p>Mười hai sứ quân cát cứ khắp nơi, từ Bắc xuống Nam:</p>
<p><strong>Ngô Xương Xí</strong> giữ Bình Kiều (Thanh Hóa) — con của Ngô Quyền, tự coi mình là người kế thừa hợp pháp. <strong>Đỗ Cảnh Thạc</strong> giữ Đỗ Động Giang (Hà Tây) — người mạnh nhất, có quân đội thiện chiến nhất. <strong>Trần Lãm</strong> giữ Bố Hải khẩu (Thái Bình) — người tích lũy được nhiều của cải nhất. <strong>Kiều Công Hãn</strong> giữ Phong Châu (Phú Thọ). Và nhiều người khác nữa, mỗi người một vùng, đánh nhau không ngừng.</p>
<p>Không ai đủ mạnh để thống nhất tất cả, nhưng cũng không ai chịu phục tùng ai. Đất nước như một mảnh gốm vỡ, mỗi mảnh sắc nhọn có thể cứa vào tay người cầm. Tình thế này kéo dài mãi, cho đến khi một nhân vật xuất hiện từ đất Hoa Lư.</p>
<h2>Cậu Bé Cờ Lau — Tuổi Thơ Kỳ Lạ</h2>
<p>Đinh Bộ Lĩnh sinh năm 924 tại động Hoa Lư (nay thuộc huyện Hoa Lư, Ninh Bình). Cha là Đinh Công Trứ từng làm quan thứ sử Hoan Châu dưới thời Dương Đình Nghệ, mất sớm khi Đinh Bộ Lĩnh còn nhỏ. Mồ côi cha, ông sống với mẹ ở vùng đồng bằng chiêm trũng Ninh Bình.</p>
<p>Câu chuyện về tuổi thơ Đinh Bộ Lĩnh được truyền tụng đến ngàn đời sau: cậu bé thường cùng bạn bè chơi trò đánh trận, bẻ bông lau làm cờ hiệu, để bạn cõng mình — làm như hoàng đế — đi khắp đồng ruộng. Những đứa trẻ nô đùa không biết rằng trò chơi ngày hôm nay sẽ trở thành hiện thực ngày mai.</p>
<p>Lớn lên, Đinh Bộ Lĩnh theo phò sứ quân Trần Lãm ở Bố Hải khẩu. Trần Lãm không có con trai, nhận ra tài năng xuất chúng của Đinh Bộ Lĩnh, coi ông như người kế thừa và truyền lại toàn bộ binh lực trước khi mất.</p>
<h2>Dẹp Loạn Từng Bước — Thống Nhất Giang Sơn</h2>
<p>Từ căn cứ Hoa Lư hiểm trở — ba mặt là núi đá, một mặt là sông — Đinh Bộ Lĩnh bắt đầu cuộc chiến thống nhất từng bước một. Ông không vội vàng, không liều lĩnh. Mỗi bước đi đều được tính toán cẩn thận: đánh sứ quân nào trước, kết minh với ai, và khi nào nên nhân nhượng.</p>
<p>Chiến lược của Đinh Bộ Lĩnh kết hợp cả quân sự lẫn ngoại giao: những sứ quân nào chịu khuất phục thì tha cho tiếp tục cai quản vùng đất của mình với tư cách chư hầu; những ai cứng đầu mới bị đánh. Cách làm này vừa tiết kiệm máu xương, vừa đảm bảo sự ổn định sau khi thống nhất.</p>
<p>Người khó đánh nhất là <strong>Đỗ Cảnh Thạc</strong> — sứ quân mạnh nhất, đóng giữ Đỗ Động Giang với lực lượng tinh nhuệ. Đinh Bộ Lĩnh mất nhiều năm để đánh hạ thành này. Nhưng cuối cùng, kiên nhẫn và mưu trí đã thắng. Đỗ Cảnh Thạc bại trận.</p>
<p>Năm 967, sứ quân cuối cùng đầu hàng hoặc bị tiêu diệt. Lần đầu tiên sau hơn hai mươi năm hỗn loạn, đất nước được thống nhất dưới một lãnh đạo duy nhất.</p>
<h2>Đại Cồ Việt — Nền Móng Quốc Gia Độc Lập</h2>
<p>Năm 968, Đinh Bộ Lĩnh lên ngôi hoàng đế, lấy hiệu là <strong>Đinh Tiên Hoàng</strong>, đặt tên nước là <strong>Đại Cồ Việt</strong> (nghĩa là "nước Việt lớn"), đóng đô tại Hoa Lư và đặt niên hiệu Thái Bình.</p>
<p>Đây là lần đầu tiên trong lịch sử, một người Việt xưng <em>hoàng đế</em> (chứ không phải vương) — thể hiện sự ngang hàng với thiên tử Trung Hoa, không chịu thần phục. Đây là tuyên ngôn ngầm về sự độc lập hoàn toàn của dân tộc Việt.</p>
<p>Đinh Tiên Hoàng xây dựng bộ máy nhà nước, đặt ra phép tắc, hình luật, tổ chức quân đội chính quy. Ông phong thưởng cho các tướng tài, sắp xếp lại quyền lực theo trật tự mới. Kinh đô Hoa Lư được xây dựng thành một trung tâm quyền lực thực sự, với cung điện, đền thờ và các công trình quân sự phòng thủ.</p>
<p>Đinh Tiên Hoàng mất năm 979 trong một vụ ám sát cung đình. Ông không kịp xây dựng hoàn chỉnh nền tảng quốc gia mà mình đã mở ra. Nhưng công lao dẹp loạn 12 sứ quân, thống nhất đất nước của ông là vô giá. Không có Đinh Bộ Lĩnh, không có nền độc lập của Đại Việt; không có Đại Việt, không có tất cả những gì nở rộ sau đó — triều Lý hưng thịnh, triều Trần đánh giặc Mông Nguyên, triều Lê mở mang văn hóa. Đinh Tiên Hoàng là nền móng của tất cả.</p>`,
  },
  {
    slug: 'ba-trieu-nu-tuong-mat-giac-vang',
    content: `<h2>Thế Kỷ III — Đất Việt Dưới Ách Nhà Ngô</h2>
<p>Thế kỷ III sau Công nguyên, sau khi nhà Hán sụp đổ và Trung Quốc chia thành ba nước (Tam Quốc), đất Giao Châu (Việt Nam) nằm dưới sự kiểm soát của Đông Ngô — một trong ba nước đó. Nhà Ngô cai trị đất Việt bằng bàn tay sắt: bóc lột tài nguyên, đàn áp mọi tiếng nói chống đối, bắt người Việt đi lính đánh các cuộc chiến tranh của người Hoa.</p>
<p>Vùng đất Cửu Chân (nay là Thanh Hóa, Nghệ An) — nơi núi rừng hiểm trở, con người cứng cỏi — luôn là tâm điểm của các cuộc nổi dậy. Và từ chính vùng đất này, một người phụ nữ trẻ 23 tuổi đã đứng lên thách thức cả đế quốc phương Bắc hùng mạnh.</p>
<h2>Triệu Thị Trinh — Người Con Gái Núi Nưa</h2>
<p>Triệu Thị Trinh sinh khoảng năm 225 sau Công nguyên tại vùng núi Nưa (nay thuộc huyện Triệu Sơn, Thanh Hóa). Bà mồ côi cha mẹ từ sớm, ở với người anh trai là Triệu Quốc Đạt — một hào trưởng địa phương có uy tín và lòng yêu nước sâu sắc.</p>
<p>Ngay từ nhỏ, Triệu Thị Trinh đã nổi tiếng trong vùng về sức mạnh phi thường và tinh thần bất khuất. Tương truyền bà cao chín thước (khoảng 2 mét theo đơn vị đo thời đó), sức có thể vật ngã trâu bò. Bà luyện võ nghệ từ sớm, tính tình thẳng thắn, ghét sự bất công và hèn nhát.</p>
<p>Khi người anh trai bàn đến việc lấy chồng, bà đã trả lời bằng những lời bất hủ truyền lại cho muôn đời:</p>
<blockquote>Tôi muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ, chém cá kình ở biển Đông, đánh đuổi quân Ngô, cởi ách nô lệ, chứ không chịu khom lưng làm tì thiếp người ta!</blockquote>
<p>Những lời đó — khẳng khái, hào hùng, không kém gì lời thề của bất kỳ anh hùng nam giới nào — ngay lập tức trở thành biểu tượng của tinh thần phụ nữ Việt Nam: không chịu khuất phục, không chịu sống trong ô nhục, dám đứng lên dù biết đường gian khó.</p>
<h2>Chuẩn Bị Khởi Nghĩa — Trong Rừng Sâu Núi Thẳm</h2>
<p>Triệu Thị Trinh và anh trai bí mật xây dựng căn cứ trong rừng núi vùng Nưa. Rừng núi Cửu Chân vừa là nơi ẩn náu an toàn, vừa là lợi thế chiến thuật: địa hình hiểm trở mà người địa phương thông thuộc, kẻ thù từ phương Bắc xuống khó mà chiến đấu hiệu quả.</p>
<p>Trong nhiều năm, hai anh em cùng các đồng chí tích lũy lương thực, rèn vũ khí, luyện tập nghĩa quân. Họ không chỉ huấn luyện chiến đấu mà còn giáo dục tinh thần: mỗi người phải hiểu rõ mình đang chiến đấu vì điều gì — vì tự do, vì phẩm giá của dân tộc, vì con cháu mai sau sẽ không phải sống trong vòng nô lệ.</p>
<h2>Khởi Nghĩa Năm 248 — Tiếng Gầm Của Cọp Cái Núi Nưa</h2>
<p>Năm 248, khi thời cơ đã chín muồi, Triệu Thị Trinh và Triệu Quốc Đạt phát lệnh khởi nghĩa. Nghĩa quân từ rừng Nưa đổ xuống như thác lũ. Tin tức về cuộc nổi dậy lan nhanh, nhân dân Cửu Chân và các vùng lân cận đồng loạt hưởng ứng.</p>
<p>Tương truyền Bà Triệu trong khi ra trận thường mặc áo giáp vàng, đi guốc ngà, cài trâm vàng, búi tóc cao, cưỡi trên đầu voi chiến lao vào trận địa. Hình ảnh một người phụ nữ trẻ, áo giáp sáng ngời, hiên ngang trên lưng voi đã trở thành nỗi kinh hoàng của quân Ngô. Họ đồn nhau: <em>"Có thể đối mặt với hổ dữ còn hơn là gặp Vương Bà!"</em></p>
<p>Nghĩa quân của Bà Triệu liên tiếp thắng nhiều trận, đánh tan nhiều đồn trại của quân Ngô. Vùng giải phóng ngày càng mở rộng. Quân Ngô ở Giao Châu không địch nổi, phải cầu cứu chính quyền trung ương.</p>
<h2>Sáu Tháng Chiến Đấu Kiên Cường</h2>
<p>Nhà Ngô cử đại tướng Lục Dận dẫn đại quân sang đàn áp. Lục Dận vừa có nhiều quân vừa được trang bị tốt hơn. Nhưng điều đáng sợ hơn là ông ta sử dụng các chiến thuật hèn hạ: mua chuộc, chia rẽ nội bộ nghĩa quân, dùng mưu kế tâm lý để làm lung lay tinh thần chiến đấu.</p>
<p>Sau sáu tháng chiến đấu ác liệt, thế địch quá đông, lại thêm nhiều thủ đoạn xảo quyệt, nghĩa quân dần thất thế. Triệu Quốc Đạt hy sinh trong trận chiến. Bà Triệu vẫn tiếp tục chiến đấu dù biết kết cục không thể tránh khỏi.</p>
<p>Năm 248, khi nghĩa quân hoàn toàn bị bao vây, Triệu Thị Trinh chọn cái chết trên núi Tùng (nay thuộc huyện Hậu Lộc, Thanh Hóa) thay vì đầu hàng. Bà mất khi mới 23 tuổi — tuổi còn rất trẻ — nhưng đã sống một cuộc đời xứng đáng hơn rất nhiều người sống đến già.</p>
<h2>Di Sản — Khí Tiết Ngàn Đời</h2>
<p>Cái chết của Triệu Thị Trinh không phải là kết thúc của câu chuyện — đó là sự bắt đầu của huyền thoại. Nhân dân Thanh Hóa và khắp nơi ngay lập tức lập đền thờ bà. Tương truyền, sau khi bà mất, vong linh bà hiển linh và tiếp tục phù hộ cho người dân trong các cuộc chiến chống giặc ngoại xâm về sau.</p>
<p>Đền thờ Bà Triệu (tại xã Triệu Lộc, huyện Hậu Lộc, Thanh Hóa) được xây dựng từ thế kỷ III và trải qua nhiều lần trùng tu, đến nay vẫn là nơi người dân hành hương tưởng nhớ. Ngày 22 tháng 2 âm lịch hàng năm là ngày giỗ của bà — một ngày lễ quan trọng của người dân xứ Thanh.</p>
<p>Hình ảnh Bà Triệu — người phụ nữ 23 tuổi dám đứng lên thách thức cả đế quốc — là biểu tượng muôn đời của phụ nữ Việt Nam: dịu dàng nhưng không yếu đuối, biết thương yêu nhưng cũng biết căm thù bất công, sẵn sàng hy sinh tất cả để sống xứng đáng với bản thân và dân tộc.</p>
<p>Câu nói của bà — <em>"Tôi muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ..."</em> — sau hơn 1.700 năm vẫn còn vang vọng, nhắc nhở mỗi người Việt về giá trị của tự do và phẩm giá con người.</p>`,
  },
]

async function run() {
  try {
    console.log('Kết nối database...')
    await sequelize.authenticate()
    console.log('Kết nối thành công.\n')

    for (const { slug, content } of ARTICLES) {
      const article = await Article.findOne({ where: { slug } })
      if (!article) {
        console.log(`  Không tìm thấy bài viết slug="${slug}", bỏ qua.`)
        continue
      }
      await article.update({ content })
      console.log(`  Đã cập nhật: ${slug}`)
    }

    console.log('\nHoàn tất cập nhật nội dung bài viết.')
  } catch (err) {
    console.error('Lỗi:', err.message)
    process.exit(1)
  } finally {
    await sequelize.close()
  }
}

run()
