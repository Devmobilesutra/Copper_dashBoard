let input = window.document.getElementsByClassName("chart")[0];
        html2canvas(input).then(canvas => {
            const img = canvas.toDataURL("image/png");
            // const pdf = new pdfConverter("l", "pt");
            pdf.addImage(
                img,
                "png",
                input.offsetLeft,
                input.offsetTop,
                input.clientWidth,
                input.clientHeight
            );
            doc.save("chart.pdf");
            but.style.display = "block";
        });