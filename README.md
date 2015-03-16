<nav id="table-of-contents">
<h2>Table of Contents</h2>
<div id="text-table-of-contents">
<ul>
<li><a href="#sec-1">1. WYSIWYG_HTML</a>
<ul>
<li><a href="#sec-1-1">1.1. Input : Tag and part_list</a>
<ul>
<li><a href="#sec-1-1-1">1.1.1. Example : simple =&gt; sibling &amp; parent-child</a></li>
<li><a href="#sec-1-1-2">1.1.2. Example : nest</a></li>
<li><a href="#sec-1-1-3">1.1.3. Example : variables &amp; calculation</a></li>
<li><a href="#sec-1-1-4">1.1.4. Example : a diff from emmet</a></li>
</ul>
</li>
<li><a href="#sec-1-2">1.2. Select</a>
<ul>
<li><a href="#sec-1-2-1">1.2.1. Two ways of selecting</a></li>
<li><a href="#sec-1-2-2">1.2.2. the way of canceling selecting</a></li>
</ul>
</li>
<li><a href="#sec-1-3">1.3. Delete</a>
<ul>
<li><a href="#sec-1-3-1">1.3.1. the way of deleting</a></li>
</ul>
</li>
<li><a href="#sec-1-4">1.4. Copy, Cut And Paste</a>
<ul>
<li><a href="#sec-1-4-1">1.4.1. the way of copying or cutting</a></li>
</ul>
</li>
<li><a href="#sec-1-5">1.5. Save or Load</a>
<ul>
<li><a href="#sec-1-5-1">1.5.1. the way of Saving or Loading</a></li>
</ul>
</li>
</ul>
</li>
</ul>
</div>
</nav>


# WYSIWYG\_HTML<a id="sec-1"></a>

Creating a HTML mock on Real browser.  
        emmet-like inputting, but not the same.

## Input : Tag and part\_list<a id="sec-1-1"></a>

### Example : simple => sibling & parent-child<a id="sec-1-1-1"></a>

-   input Tag:
    article>header+section+footer
-   output HTML:
    
        <article>
        <header></header>
        <section></section>
        <footer></footer>
        </article>
    
    -   ">" means parent > child.
    -   "+" means sibling.

### Example : nest<a id="sec-1-1-2"></a>

-   input Tag:
    article>MyHeader+MySectionParagraph(3)+footer
-   input part\_list:
    -   MyHeader | header>h3
    -   MySectionParagraph | section>p\*$0
-   output HTML:
    
        <article>
                <header>
                <h3></h3>
                </header>
        <section>
        <p></p>
        <p></p>
        <p></p>
        </section>
        <footer></footer>
        </article>
-   "tag\*num" means outputting the tag num times.
-   "$n" means The n-th param.(zero origin)
-   Not supported : Nest by parenthesis.

### Example : variables & calculation<a id="sec-1-1-3"></a>

-   input Tag:
    tr>th\*($a 3 =)+td\*$a  
                     (Or "tr>th\*$a 3 =+td\*$a" is also OK, however bad coding.)
    
        <tr>
          <th></th><th></th><th></th>
          <td></td><td></td><td></td>
        </tr>
-   variables name style : $name.
-   calculation : reversed porlish notation  
                            you can use  + - \* / % ( ) =. parenthesis are used for nesting.  
                            (I'm Japanese. And I adopt this since this notation resembles the word order of Japanese Language.)

### Example : a diff from emmet<a id="sec-1-1-4"></a>

-   input Tag:
    article>section+div>span
-   output HTML:
    
        <article>
          <section>
            <span></span>
                </section>
                <div>
            <span></span>
                </div>
        </article>

## Select<a id="sec-1-2"></a>

The borders of selected elements become dotted and red. Their children become transparent.  
         You cau select some elements.

### Two ways of selecting<a id="sec-1-2-1"></a>

1.  Click
    you click a element, and then elemetns under the element get selected.
2.  Input obj-id and Click "Select" button.
    In this app, obj-id is named like 0-1-2, 0-1-3.   
                     obj-id 0 is screen itself. So obj-id 0-1 or 0-n are top node.

### the way of canceling selecting<a id="sec-1-2-2"></a>

-   click again.
-   click screen.

## Delete<a id="sec-1-3"></a>

### the way of deleting<a id="sec-1-3-1"></a>

Select elements and Click "Delete" button.

## Copy, Cut And Paste<a id="sec-1-4"></a>

The border of copyed or cut elements become dotted and green, blue. Their children become transparent.  
         You cau select some elements.

### the way of copying or cutting<a id="sec-1-4-1"></a>

1.  Select elements and Click "copy" or "cut" button.
2.  Select elements for pasting.
3.  Click "paste" button.

## Save or Load<a id="sec-1-5"></a>

This App stores data to your browser's localStorage.  
         The number of Save slots is 3.(If you'd like to increase, Plz mod source code.)

### the way of Saving or Loading<a id="sec-1-5-1"></a>

1.  Push ESC key and save-load panel is got out.
2.  Click "Save", and elements on screen are saved.
