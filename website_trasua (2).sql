-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th7 10, 2025 lúc 11:59 AM
-- Phiên bản máy phục vụ: 5.7.31
-- Phiên bản PHP: 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `website_trasua`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_chitietdonhang`
--

DROP TABLE IF EXISTS `tbl_chitietdonhang`;
CREATE TABLE IF NOT EXISTS `tbl_chitietdonhang` (
  `id_chitiet` int(11) NOT NULL AUTO_INCREMENT,
  `id_donhang` int(11) NOT NULL,
  `id_sanpham` int(11) NOT NULL,
  `size` varchar(10) DEFAULT NULL,
  `ice` varchar(10) DEFAULT NULL,
  `sugar` varchar(10) DEFAULT NULL,
  `tensanpham` varchar(255) NOT NULL,
  `hinhanh` varchar(255) DEFAULT NULL,
  `soluong` int(11) NOT NULL,
  `dongia` int(11) NOT NULL,
  `tongtien` int(11) GENERATED ALWAYS AS ((`soluong` * `dongia`)) STORED,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_chitiet`),
  KEY `id_donhang` (`id_donhang`),
  KEY `id_sanpham` (`id_sanpham`)
) ENGINE=MyISAM AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_dangky`
--

DROP TABLE IF EXISTS `tbl_dangky`;
CREATE TABLE IF NOT EXISTS `tbl_dangky` (
  `id_dangky` int(11) NOT NULL AUTO_INCREMENT,
  `tenkhachhang` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `matkhau` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `diachi` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `trangthai` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_super_admin` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_dangky`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `tbl_dangky`
--

INSERT INTO `tbl_dangky` (`id_dangky`, `tenkhachhang`, `email`, `matkhau`, `avatar`, `diachi`, `role`, `trangthai`, `created_at`, `is_super_admin`) VALUES
(1, 'Super Admin', 'admin@gmail.com', 'c4ca4238a0b923820dcc509a6f75849b', NULL, NULL, 'admin', 1, '2025-07-10 17:10:48', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_danhgia`
--

DROP TABLE IF EXISTS `tbl_danhgia`;
CREATE TABLE IF NOT EXISTS `tbl_danhgia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_sanpham` int(11) NOT NULL,
  `id_khachhang` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text,
  `hinhanh` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_danhmuc`
--

DROP TABLE IF EXISTS `tbl_danhmuc`;
CREATE TABLE IF NOT EXISTS `tbl_danhmuc` (
  `id_danhmuc` int(11) NOT NULL AUTO_INCREMENT,
  `tendanhmuc` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_danhmuc`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_danhmuc`
--

INSERT INTO `tbl_danhmuc` (`id_danhmuc`, `tendanhmuc`, `slug`) VALUES
(22, 'Trà sữa', 'trasua'),
(23, 'Trà', 'tra'),
(24, 'Hồng trà', 'hongtra'),
(28, 'Yakult', 'yakult'),
(29, 'Topping', 'topping');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_donhang`
--

DROP TABLE IF EXISTS `tbl_donhang`;
CREATE TABLE IF NOT EXISTS `tbl_donhang` (
  `id_donhang` int(11) NOT NULL AUTO_INCREMENT,
  `id_khachhang` int(11) NOT NULL,
  `tennguoinhan` varchar(255) DEFAULT NULL,
  `sodienthoai` varchar(20) DEFAULT NULL,
  `tongtien_sanpham` bigint(20) DEFAULT NULL,
  `trangthai` varchar(50) DEFAULT NULL,
  `hinhthucthanhtoan` enum('cod','vnpay','momo') DEFAULT 'cod',
  `diachi_nhan` varchar(255) NOT NULL,
  `ghichu` text,
  `ngaydat` datetime DEFAULT CURRENT_TIMESTAMP,
  `ship_fee` int(11) DEFAULT NULL,
  `total_payment` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id_donhang`),
  KEY `id_khachhang` (`id_khachhang`)
) ENGINE=MyISAM AUTO_INCREMENT=113 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tbl_sanpham`
--

DROP TABLE IF EXISTS `tbl_sanpham`;
CREATE TABLE IF NOT EXISTS `tbl_sanpham` (
  `id_sanpham` int(11) NOT NULL AUTO_INCREMENT,
  `tensanpham` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `giasp` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hinhanh` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tomtat` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tinhtrang` int(11) NOT NULL,
  `id_danhmuc` int(11) NOT NULL,
  PRIMARY KEY (`id_sanpham`),
  KEY `fk_sanpham_danhmuc_01` (`id_danhmuc`)
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `tbl_sanpham`
--

INSERT INTO `tbl_sanpham` (`id_sanpham`, `tensanpham`, `giasp`, `hinhanh`, `tomtat`, `tinhtrang`, `id_danhmuc`) VALUES
(48, 'Trà sữa socola', '20000', '1752037663_1trasuasocola.png', 'Trà sữa socola là sự kết hợp giữa vị đắng nhẹ của cacao, vị ngọt béo của sữa và hương trà dịu nhẹ. Thức uống này thơm ngon, mát lạnh, thường được thêm trân châu hoặc thạch, rất được ưa chuộng bởi giới trẻ.', 1, 22),
(49, 'Trà sữa bơ tiramisu', '21000', '1752037652_2trasuabotiramisu.png', 'Trà sữa bơ tiramisu là sự hòa quyện giữa vị béo mịn của bơ, hương cà phê nhẹ từ tiramisu và vị trà thanh mát. Thức uống thơm ngậy, ngọt dịu, thường kèm kem cheese hoặc trân châu, mang đến cảm giác sang trọng và lạ miệng.', 1, 22),
(50, 'Trà sữa tiramisu', '22000', '1752037642_3trasuatiramisu.png', 'Trà sữa tiramisu là sự kết hợp độc đáo giữa vị béo ngậy của kem sữa, hương thơm cà phê nhẹ và vị ngọt tinh tế từ bánh tiramisu, tạo nên một loại thức uống vừa lạ miệng, vừa hấp dẫn, thích hợp cho những ai yêu thích vị ngọt pha chút đắng nhẹ.', 1, 22),
(51, 'Trà sữa muối', '23000', '1752037631_4trasuamuoi.png', 'Trà sữa muối là sự kết hợp giữa trà sữa truyền thống và lớp kem cheese mặn ngọt phía trên.\r\nHương vị béo mịn, mằn mặn nhẹ giúp cân bằng vị ngọt của trà sữa. Đây là lựa chọn độc đáo, hấp dẫn với những ai thích hương vị lạ miệng.', 1, 22),
(52, 'Trà sữa cacao đường đen', '24000', '1752037616_5cacaosuatuoitranchauduongden.png', 'Trà sữa cacao đường đen là thức uống kết hợp giữa cacao đậm vị và trân châu đường đen dẻo ngọt. Lớp cacao thơm lừng hòa quyện cùng sữa mang đến cảm giác béo và đậm đà. Vị ngọt của đường đen và vị đăng đắng của cacao tạo nên sự cân bằng hấp dẫn.', 1, 22),
(53, 'Hồng trà nhật nguyệt', '25000', '1752037594_6hongtranhatnguyet.png', 'Hồng trà Nhật Nguyệt là loại trà đỏ nổi tiếng từ vùng núi cao Đài Loan, thơm nhẹ và thanh. Vị trà đậm đà, hậu ngọt kéo dài, thích hợp dùng lạnh hoặc nóng. Thường được pha chế trong các món trà sữa cao cấp.', 1, 24),
(54, 'Hồng trà mật ong', '26000', '1752037581_7hongtranhatnguyetmatong.png', 'Hồng trà mật ong là sự kết hợp giữa hồng trà thơm đậm và vị ngọt dịu của mật ong nguyên chất. Hương vị hài hòa, dễ uống, mang lại cảm giác thanh mát. Thích hợp làm đồ uống giải nhiệt hoặc dùng kèm trân châu.', 1, 24),
(55, 'Trà lựu đỏ thạch dừa', '28000', '1752037562_8luudothachdua.png', 'Trà lựu đỏ thạch dừa là sự hòa quyện giữa vị chua ngọt tươi mát của lựu đỏ và độ giòn dai của thạch dừa. Thức uống mang màu sắc bắt mắt, hấp dẫn. Rất phù hợp cho ngày hè nóng bức.', 1, 23),
(56, 'Trà lựu đỏ mảng cầu', '29000', '1752037550_9luudomangcau.png', 'Trà lựu đỏ mãng cầu là sự kết hợp độc đáo giữa vị chua thanh của mãng cầu và vị ngọt mát của lựu đỏ. Hương vị tươi mới, giàu vitamin. Thức uống lý tưởng để giải nhiệt và tiếp thêm năng lượng.\r\n\r\n\r\n\r\n', 1, 23),
(57, 'Trà lựu đỏ thanh mai', '30000', '1752037538_10luudothanhmai.png', 'Trà lựu đỏ thanh mai là thức uống trái cây mát lạnh, kết hợp giữa vị ngọt dịu của lựu đỏ và vị chua nhẹ của thanh mai. Hương vị hài hòa, thanh mát, giúp giải khát, giải nhiệt hiệu quả, rất thích hợp cho những ngày nắng nóng.', 1, 23),
(58, 'Trà oolong búp sen', '21000', '1752037523_11olongbupsen.png', 'Trà oolong búp sen là sự kết hợp tinh tế giữa trà oolong thơm dịu và hương sen thanh khiết. Vị trà nhẹ nhàng, hậu ngọt, mang đến cảm giác thư giãn, thanh lọc cơ thể. Thích hợp để thưởng thức hàng ngày hoặc khi cần sự tĩnh lặng, thư thái.', 1, 23),
(59, 'Trà sen vàng', '22000', '1752037495_12senvang.png', 'Trà sen vàng có hương thơm dịu nhẹ của sen kết hợp với vị trà thanh mát, hậu ngọt sâu. Thức uống mang lại cảm giác dễ chịu, thư giãn và hỗ trợ thanh lọc cơ thể, thích hợp để thưởng thức mỗi ngày.', 1, 23),
(60, 'Trà sữa sương sáo', '24000', '1752037478_14suongsaothaomoc.png', 'Trà sữa sương sáo có vị béo ngậy của sữa hoà quyện với vị thanh mát của sương sáo. Thức uống vừa ngọt dịu, vừa giải nhiệt, mang đến cảm giác mát lạnh và ngon miệng.', 1, 22),
(61, 'Trà sữa Matcha váng sữa', '25000', '1752037457_15trasuamatchavangsua.png', 'Trà sữa Matcha váng sữa kết hợp vị đậm đà của trà xanh matcha với lớp ván sữa béo mịn. Hương vị hài hòa, thơm ngậy, vừa mát lạnh vừa đầy năng lượng, hấp dẫn ngay từ ngụm đầu tiên.', 1, 22),
(62, 'Trà sữa shan tuyết lài', '25000', '1752037445_16trasuashantuyetlai.png', 'Trà sữa Shan Tuyết Lài là sự hòa quyện giữa hương thơm thanh tao của hoa lài và vị đậm đà của trà Shan Tuyết. Thức uống mang đến cảm giác nhẹ nhàng, béo dịu và thanh mát, thích hợp để thưởng thức mỗi ngày.', 1, 22),
(64, 'Trà đào hồng', '27000', '1752037430_18tradaohong.png', 'Trà đào hồng có hương thơm dịu nhẹ, vị đào ngọt thanh quyện cùng nền trà tươi mát. Màu hồng đẹp mắt, hương vị dễ chịu, thích hợp để giải nhiệt và thư giãn mỗi ngày.', 1, 23),
(65, 'Trà lài mật ong', '28000', '1752037418_19tralaimatongkemtrungkhe.png', 'Trà lài mật ong là sự kết hợp tinh tế giữa hương hoa lài thanh mát và vị ngọt dịu của mật ong. Thức uống nhẹ nhàng, thanh lọc cơ thể, giúp thư giãn và tăng cường sức khỏe.', 1, 23),
(66, 'Trà sữa đậu đỏ', '29000', '1752037402_20trasuadaudo.png', 'Trà sữa đậu đỏ kết hợp vị béo ngậy của sữa với đậu đỏ bùi bùi, ngọt nhẹ. Thức uống thơm ngon, dễ uống, mang đến cảm giác no nhẹ và sảng khoái.\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n', 1, 22),
(67, 'Trà sữa cheese ball', '30000', '1752037389_21trasuacheeseball.png', 'Trà sữa cheese ball là sự hòa quyện giữa trà sữa béo ngậy và topping viên phô mai dẻo mặn mà. Hương vị độc đáo, béo mặn xen lẫn ngọt dịu, tạo cảm giác thú vị trong từng ngụm.', 1, 22),
(68, 'Trà sữa bơ', '21000', '1752037366_22trasuabo.png', 'Trà sữa bơ mang hương vị béo ngậy của sữa kết hợp cùng vị thơm mát, mềm mịn của bơ chín. Thức uống vừa ngọt dịu, vừa đậm đà, tạo cảm giác tươi mới và hấp dẫn.', 1, 22),
(69, 'Trà sữa trân châu hoàng kim', '22000', '1752037347_23trasuatranchauhoangkim.png', 'Trà sữa trân châu hoàng kim là sự kết hợp giữa trà sữa thơm béo và trân châu vàng dai giòn, ngọt nhẹ. Thức uống hấp dẫn bởi màu sắc bắt mắt, hương vị hài hòa và cảm giác thú vị trong từng ngụm.', 1, 22),
(70, 'Trà sữa trân châu trắng', '23000', '1752037333_24trasuatranchautrang.png', 'Trà sữa trân châu trắng kết hợp vị béo ngậy của trà sữa với trân châu trắng dai nhẹ, giòn sật. Thức uống mang đến cảm giác thanh nhẹ, dễ uống và đầy lôi cuốn.', 1, 22),
(71, 'Trà thơm', '24000', '1752037315_25trathom.png', 'Trà thơm là sự kết hợp giữa trà thanh mát và hương vị ngọt dịu, chua nhẹ của trái thơm (dứa). Thức uống có mùi thơm tự nhiên, vị tươi mát, giúp giải khát và kích thích vị giác.', 1, 23),
(72, 'Yakult lựu đỏ', '25000', '1752037291_26yakulkluudo.png', 'Yakult lựu đỏ là sự kết hợp giữa men Yakult lên men tốt cho tiêu hoá và vị ngọt chua thanh mát từ lựu đỏ. Thức uống có hương vị tươi mới, hỗ trợ hệ tiêu hóa và mang lại cảm giác sảng khoái.\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n', 1, 28),
(73, 'Yakult mận', '26000', '1752037272_27yakulkman.png', 'Yakult mận kết hợp men Yakult tốt cho tiêu hóa với vị chua ngọt đặc trưng của mận. Thức uống có hương vị lạ miệng, tươi mát, giúp làm dịu cơ thể và hỗ trợ hệ tiêu hóa hiệu quả.', 1, 28),
(74, 'Trà vải', '27000', '1752037245_travai28.png', 'Trà vải là sự kết hợp giữa trà thanh mát và vị ngọt thơm tự nhiên của quả vải. Thức uống mang đến cảm giác sảng khoái, dễ chịu, rất thích hợp để giải nhiệt trong những ngày oi nóng.', 1, 23),
(75, 'Trà tắc', '28000', '1752037161_29tratac.png', 'Trà tắc là thức uống dân dã với vị chua thanh của tắc (quất) hoà quyện cùng vị trà nhẹ nhàng. Hương vị tươi mát, dễ uống, giúp giải nhiệt, thanh lọc cơ thể và tỉnh táo tức thì.', 1, 23),
(76, 'Trà mảng cầu oolong', '29000', '1752037146_30tramangcauolongxuanxanh.png', 'Trà mảng cầu oolong kết hợp vị chát nhẹ của trà oolong với vị chua ngọt đặc trưng của mảng cầu. Thức uống mang đến hương vị tươi mát, lạ miệng và sảng khoái trong từng ngụm.', 1, 23),
(77, 'Trà oolong sen chanhh', '30000', '1752037123_31traolongsenchanhgiatay.png', 'Trà oolong sen chanh là sự hòa quyện giữa vị trà oolong đậm đà, hương sen nhẹ nhàng và vị chanh chua thanh mát. Thức uống mang đến cảm giác sảng khoái, thanh lọc cơ thể và thư giãn tinh thần.\r\n\r\n', 1, 23),
(89, 'Khúc bạch chân mèo', '5000', '1752036720_topping1.png', 'Khúc bạch chân mèo là sự kết hợp độc đáo giữa thạch khúc bạch béo mịn và thạch “chân mèo” dai giòn, có hình dáng đáng yêu, vị ngọt dịu. Món tráng miệng mát lạnh, ngon miệng và cực kỳ bắt mắt, phù hợp với giới trẻ và tín đồ mê đồ ngọt.', 1, 29),
(90, 'Khúc bạch Phomai', '5000', '1752036792_topping2.png', 'Khúc bạch phô mai là món tráng miệng mát lạnh với thạch mềm mịn, béo nhẹ từ sữa và kem, kết hợp vị mặn mà thơm ngậy của phô mai. Ăn kèm cùng trái cây hoặc hạnh nhân rang giúp tăng hương vị và độ hấp dẫn.', 1, 29),
(91, 'Thạch củ năng', '5000', '1752036839_topping3.png', 'Thạch củ năng giòn giòn, ngọt nhẹ, thấm đẫm siro hương lá dứa. Topping lý tưởng cho trà sữa, sữa tươi hoặc các món tráng miệng, mang đến cảm giác tươi mát và sảng khoái trong từng miếng.', 1, 29),
(92, 'Sương sáo thảo mộc', '5000', '1752036885_topping4.png', 'Sương sáo là loại thạch đen mát lạnh, có vị thanh nhẹ và hơi đăng đắng đặc trưng, được làm từ lá sương sáo. Thường dùng kèm trà sữa, sữa tươi hoặc món tráng miệng để giải nhiệt và thanh lọc cơ thể.', 1, 29),
(93, 'Bánh plan', '5000', '1752036963_topping5.png', 'Bánh flan là món tráng miệng mềm mịn, béo ngậy từ trứng và sữa, phủ lớp caramel thơm ngọt nhẹ. Khi ăn mát lạnh, bánh tan trong miệng, mang lại cảm giác ngọt dịu và dễ chịu, phù hợp với mọi lứa tuổi.', 1, 29),
(94, 'Thạch trái cây', '5000', '1752037000_topping6.png', 'Thạch trái cây là loại thạch nhiều màu sắc, được làm từ nước ép hoặc hương trái cây tự nhiên như xoài, dâu, cam, vải… Thạch mềm mịn, ngọt thanh, mát lạnh, thường dùng làm topping cho trà sữa, sữa chua hoặc món tráng miệng.', 1, 29);

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `tbl_sanpham`
--
ALTER TABLE `tbl_sanpham`
  ADD CONSTRAINT `fk_sanpham_danhmuc` FOREIGN KEY (`id_danhmuc`) REFERENCES `tbl_danhmuc` (`id_danhmuc`),
  ADD CONSTRAINT `fk_sanpham_danhmuc_01` FOREIGN KEY (`id_danhmuc`) REFERENCES `tbl_danhmuc` (`id_danhmuc`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
